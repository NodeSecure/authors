// Import Internal Dependencies
import { useLevenshtein } from "./levenshtein.js";
import {
  getDomainExpirationFromMemory,
  storeDomainExpirationInMemory,
  hasBeenActive
} from "./helper.js";

// Import Third-party Dependencies
import { whois, resolveMxRecords } from "@nodesecure/domain-check";
import { getContributorLastActivities } from "@nodesecure/github";

const kGithubUrl = "https://github.com/";

function splitAuthorNameEmail(author) {
  const indexStartEmail = author.name.search(/[<]/g);
  const indexEndEmail = author.name.search(/[>]/g);

  if (indexStartEmail === -1 && indexEndEmail === -1) {
    return {
      name: author.name,
      email: "email" in author ? author.email : ""
    };
  }

  return {
    name: author.substring(0, indexStartEmail).trim(),
    email: author.substring(indexStartEmail, indexEndEmail).trim()
  };
}

function hasBeenActiveOnNpm(author) {
  if (!author.at) {
    return false;
  }

  return hasBeenActive(author.at);
}

async function hasBeenActiveOnGithub(authors, homepage) {
  if (!homepage.startsWith(kGithubUrl)) {
    return authors;
  }

  const [owner, repository] = homepage.replace(kGithubUrl, "").split("/");
  const parsedRepositoryName = repository.endsWith("#readme") ? repository.replace("#readme", "") : repository;

  return Promise.all(authors.map(async(author) => {
    const [lastEvent, lastRelatedEvent] = await getContributorLastActivities({
      owner,
      repository: parsedRepositoryName,
      contributor: author.name
    }) ?? [];

    if (!lastEvent) {
      author.hasBeenActiveOnGithub = null;
      author.hasBeenActiveOnGithubRepo = null;

      return author;
    }

    author.hasBeenActiveOnGithub = hasBeenActive(lastEvent.lastActivity);
    author.hasBeenActiveOnGithubRepo = lastRelatedEvent ?
      hasBeenActive(lastRelatedEvent.lastActivity) : false;

    return author;
  }));
}

export async function extractAllAuthorsFromLibrary(library, opts = { flags: [], domainInformations: false }) {
  if (!("dependencies" in library)) {
    return [];
  }

  const authors = [];

  for (const [packageName, packageData] of Object.entries(library.dependencies)) {
    const { author, maintainers, publishers, homepage, lastVersion } = packageData.metadata;

    const packageMeta = {
      homepage: homepage || "",
      spec: packageName,
      versions: lastVersion
    };

    let authorsFound = formatAuthors({ author, maintainers, publishers });

    authorsFound = await hasBeenActiveOnGithub(authorsFound, homepage);

    for (const author of authorsFound) {
      if (author === undefined) {
        continue;
      }
      authors.push({
        name: author.name,
        email: author.email,
        flagged: false,
        packages: [{
          ...packageMeta,
          isPublishers: Boolean(author.at),
          havePublishRecently: hasBeenActiveOnNpm(author),
          hasBeenActiveOnGithubRepo: author.hasBeenActiveOnGithubRepo
        }],
        hasBeenActiveOnGithub: author.hasBeenActiveOnGithub
      });
    }
  }
  if (authors.length === 0) {
    return [];
  }

  const authorsWithFlags = addFlagsInResponse(useLevenshtein(authors), opts.flags);

  if (opts.domainInformations === true) {
    return addDomainInformations(authorsWithFlags);
  }

  return authorsWithFlags;
}

async function addDomainInformations(authors) {
  for (const author of authors) {
    if (author.email === "") {
      continue;
    }
    const domain = author.email.split("@")[1];
    const mxRecords = await resolveMxRecords(domain);

    if (getDomainExpirationFromMemory(domain) !== undefined) {
      author.domain = {
        expirationDate: getDomainExpirationFromMemory(domain),
        mxRecords
      };

      continue;
    }

    const expirationDate = await whois(domain);
    storeDomainExpirationInMemory({ domain, expirationDate });
    author.domain = {
      expirationDate,
      mxRecords
    };
  }

  return authors;
}


function addFlagsInResponse(authors, flags) {
  for (const author of authors) {
    for (const flag of flags) {
      if (flag.name === author.name || flag.email === author.email) {
        author.flagged = true;
      }
    }
  }

  return authors;
}


function iterateOver(iterable, arrayAuthors) {
  for (const contributor of iterable) {
    if (arrayAuthors.find((el) => el.name === contributor.name)) {
      const index = arrayAuthors.findIndex((el) => el.name === contributor.name);

      if (arrayAuthors[index].email && arrayAuthors[index].name) {
        if (contributor.at && contributor.version) {
          arrayAuthors[index].at = contributor.at;
          arrayAuthors[index].version = contributor.version;
        }
        continue;
      }
      arrayAuthors[index] = contributor;
    }
    else {
      arrayAuthors.push(contributor);
    }
  }
}

function formatAuthors({ author, maintainers, publishers }) {
  const authors = [];

  if (author?.name !== undefined) {
    authors.push(splitAuthorNameEmail(author));
  }
  iterateOver(maintainers, authors);
  iterateOver(publishers, authors);

  return useLevenshtein(authors);
}

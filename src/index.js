// Import Internal Dependencies
import { useLevenshtein } from "./levenshtein.js";
import { getDomainExpirationFromMemory, storeDomainExpirationInMemory } from "./helper.js";
import { whois, resolveMxRecords } from "@nodesecure/domain-check";

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

export async function extractAllAuthors(library, opts = { flags: [], domainInformations: false }) {
  if (!("dependencies" in library)) {
    return [];
  }

  const authors = [];

  for (let index = 0; index < Object.values(library.dependencies).length; index++) {
    const currPackage = {
      packageName: Object.keys(library.dependencies)[index],
      ...Object.values(library.dependencies)[index]
    };

    const { author, maintainers, publishers } = currPackage.metadata;
    const packageMeta = {
      homepage: currPackage.metadata.homepage || "",
      spec: currPackage.packageName,
      versions: currPackage.metadata.lastVersion
    };

    const authorsFound = formatAuthors({ author, maintainers, publishers });

    for (const author of authorsFound) {
      if (author === undefined) {
        continue;
      }
      authors.push({
        name: author.name,
        email: author.email,
        packages: [{
          ...packageMeta,
          ...(author?.at ? { at: author.at } : {})
        }]
      });
    }
  }
  if (authors.length === 0) {
    return [];
  }

  const authorsFlagged = findFlaggedAuthors(useLevenshtein(authors), opts.flags);

  if (opts.domainInformations === true) {
    return addDomainInformations(authors);
  }

  return {
    authorsFlagged,
    authors
  };
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


function findFlaggedAuthors(authors, flags) {
  const res = [];
  for (const author of authors) {
    for (const flag of flags) {
      if (flag.name === author.name || flag.email === author.email) {
        res.push({ name: author.name, email: author.email });
      }
    }
  }

  return res;
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

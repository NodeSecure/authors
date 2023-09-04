// Import Internal Dependencies
import { getDomainInformations } from "./src/domains.js";
import { useLevenshtein } from "./src/levenshtein.js";
import { getDomainExpirationFromMemory, storeDomainExpirationInMemory } from "./src/helper.js";
import * as utils from "./src/utils.js";

export async function extractAllAuthors(
  library,
  opts = { flaggedAuthors: [], domainInformations: false }
) {
  if (!("dependencies" in library)) {
    throw new Error("You must provide a list of dependencies");
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

    const authorsFound = utils.formatAuthors({ author, maintainers, publishers });

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
    return {
      authorsFlagged: [],
      authors: []
    };
  }

  const authorsFlagged = Array.from(findFlaggedAuthors(
    useLevenshtein(authors),
    opts.flaggedAuthors
  ));
  if (opts.domainInformations) {
    await addDomainInformations(authors);
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

    if (domain) {
      author.domain = await getDomainInformations(domain);
    }
  }

  return authors;
}

function* findFlaggedAuthors(authors, flaggedAuthors = []) {
  for (const author of authors) {
    for (const flaggedAuthor of flaggedAuthors) {
      if (flaggedAuthor.name === author.name || flaggedAuthor.email === author.email) {
        yield { name: author.name, email: author.email };
      }
    }
  }
}
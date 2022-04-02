// Import Internal Dependencies
import { useLevenshtein } from "./levenshtein.js";

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

export function extractAllAuthorsFromLibrary(library, flags = []) {
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
      authors.push({
        name: author.name,
        email: author.email,
        flagged: false,
        packages: [{
          ...packageMeta,
          isPublishers: Boolean(author.at)
        }]
      });
    }
  }

  return addFlagsInResponse(useLevenshtein(authors), flags);
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

  authors.push(splitAuthorNameEmail(author));

  iterateOver(maintainers, authors);
  iterateOver(publishers, authors);

  return useLevenshtein(authors);
}

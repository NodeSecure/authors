// Import Internal Dependencies
import { useLevenshtein } from "./levenshtein.js";

// See: scanner/types/scanner.d.ts -> Dependency.metadata
export function extractAndOptimizeUsers(dependencyMetadata, flags) {
  if (!dependencyMetadata) {
    return [];
  }

  const { author, maintainers, publishers } = dependencyMetadata;

  const response = formatResponse({ author, maintainers, publishers }, flags);

  return addFlagsInResponse(response, flags);
}

export function extractAllAuthorsFromLibrary(library = {}, flags) {
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
    const { packageName } = currPackage;

    const authorsFound = formatResponse({ author, maintainers, publishers, packageName });

    authors.push(...authorsFound);
  }

  const response = useLevenshtein(authors);

  return addFlagsInResponse(response, flags);
}

function addFlagsInResponse(authors, flags = []) {
  const flagsResponse = [];

  if (Object.keys(flags).length === 0) {
    return {
      authors
    };
  }

  for (const author of authors) {
    for (const flag of flags) {
      if (flag.name === author.name || flag.email === author.email) {
        flagsResponse.push({
          name: author.name,
          email: author.email,
          packageName: author.packageName ? author.packageName : null
        });
      }
    }
  }

  return {
    authors,
    flags: flagsResponse
  };
}

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

function formatResponse({ author, maintainers, publishers, packageName = null }) {
  const authors = [];

  function foundAuthorName(author) {
    return authors.find((el) => el.name === author.name);
  }

  authors.push(splitAuthorNameEmail(author));

  for (const maintainer of maintainers) {
    if (foundAuthorName(maintainer)) {
      const authorIndex = authors.findIndex((el) => el.name === maintainer.name);

      if (authors[authorIndex].email && authors[authorIndex].name) {
        continue;
      }
      authors[authorIndex] = maintainer;
    }
    else {
      authors.push(maintainer);
    }
  }

  for (const publisher of publishers) {
    if (foundAuthorName(publisher)) {
      const authorIndex = authors.findIndex((el) => el.name === publisher.name);

      if (authors[authorIndex].email && authors[authorIndex].name) {
        continue;
      }
      authors[authorIndex] = publisher;
    }
    else {
      authors.push(publisher);
    }
  }

  return useLevenshtein(authors, packageName);
}

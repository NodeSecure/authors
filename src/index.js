// Import Internal Dependencies
import { useLevenshtein } from "./levenshtein.js";

// See: scanner/types/scanner.d.ts -> Dependency.metadata
export function extractAndOptimizeUsers(dependencyMetadata) {
  if (!dependencyMetadata) {
    return [];
  }

  const { author, maintainers, publishers } = dependencyMetadata;

  return formatResponse(author, maintainers, publishers);
}

export function extractAllAuthorsFromLibrary(library) {
  if (!library) {
    return [];
  }

  const authors = [];
  for (const dep of Object.values(library.dependencies)) {
    const { author, maintainers, publishers } = dep.metadata;

    const authorsFound = formatResponse(author, maintainers, publishers);
    if (authorsFound) {
      for (const author of authorsFound) {
        authors.push(author);
      }
    }
  }

  return useLevenshtein(authors);
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

function formatResponse(author, maintainers, publishers) {
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

  return useLevenshtein(authors);
}

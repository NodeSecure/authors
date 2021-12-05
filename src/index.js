// Import Internal Dependencies
import { useLevenshtein } from "./levenshtein.js";

// Import Third-Party Dependencies
import * as httpie from "@myunisoft/httpie";

// See: scanner/types/scanner.d.ts -> Dependency.metadata
export async function extractAndOptimizeUsers(dependencyMetadata) {
  if (!dependencyMetadata) {
    return [];
  }

  const { author, maintainers, publishers } = dependencyMetadata;

  return formatResponse(author, maintainers, publishers);
}

function splitAuthorNameEmail(author) {
  const indexStartEmail = author.name.search(/[<]/g);
  const indexEndEmail = author.name.search(/[>]/g);

  if (indexStartEmail === -1 && indexEndEmail === -1) {
    return { ...author };
  }

  return {
    name: author.substring(0, indexStartEmail).trim(),
    email: author.substring(indexStartEmail, indexEndEmail).trim()
  };
}

async function formatResponse(author, maintainers, publishers) {
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

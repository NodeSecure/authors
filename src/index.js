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

  const authors = await formatResponse(author, maintainers, publishers);

  return authors;
}

function splitAuthorNameEmail(author) {
  const indexStartEmail = author.search(/[<]/g);
  const indexEndEmail = author.search(/[>]/g);

  if (indexStartEmail === -1 && indexEndEmail === -1) {
    return {
      name: author,
      email: ""
    };
  }

  return {
    name: author.substring(0, indexStartEmail).trim(),
    email: author.substring(indexStartEmail, indexEndEmail).trim()
  };
}

async function formatResponse(author, maintainers, publishers) {
  const authors = new Array();

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
      else {
        authors[authorIndex] = maintainer;
      }
    }
    else {
      authors.push(maintainer);
    }
  }

  for await (const publisher of publishers) {
    try {
      const { data } = await httpie.get(`https://r.cnpmjs.org/-/user/org.couchdb.user:${publisher.name}`);
      const { name, email } = data;

      if (foundAuthorName(publisher)) {
        const authorIndex = authors.findIndex((el) => el.name === publisher.name);

        if (authors[authorIndex].email && authors[authorIndex].name) {
          continue;
        }
        else {
          authors[authorIndex] = publisher;
        }
      }
      else {
        authors.push({
          name,
          email
        });
      }
    }
    catch (err) {
      continue;
    }
  }

  return useLevenshtein(authors);
}

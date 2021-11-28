/* eslint-disable no-sequences */
/**
 * Email from npm user name: https://r.cnpmjs.org/-/user/org.couchdb.user:fraxken
 *
 * for metadata: https://github.com/sindresorhus/npm-user (scraping).
 */

// See: scanner/types/scanner.d.ts -> Dependency.metadata
export function extractAndOptimizeUsers(dependencyMetadata) {
  if (!dependencyMetadata) {
    return [];
  }

  const { author, maintainers, publishers } = dependencyMetadata;

  return formatResponse(author, maintainers, publishers);
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

function formatResponse(author, maintainers, publishers) {
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
      authors[authorIndex] = maintainer;
    }
    else {
      authors.push(maintainer);
    }
  }

  for (const publisher of publishers) {
    if (!foundAuthorName(publisher)) {
      authors.push({
        name: publisher.name
      });
    }
  }

  return authors;
}

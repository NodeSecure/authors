/**
 * Email from npm user name: https://r.cnpmjs.org/-/user/org.couchdb.user:fraxken
 *
 * for metadata: https://github.com/sindresorhus/npm-user (scraping).
 */

// See: scanner/types/scanner.d.ts -> Dependency.metadata
export async function extractAndOptimizeUsers(dependencyMetadata) {
  if (!'author', 'maintainers', 'publishers' in dependencyMetadata) {
    throw new TypeError(
      "There is a problem with your object parameters, please check if you have 'author', 'maintainers','publishers'"
    );
  }
  const { author, maintainers, publishers } = dependencyMetadata;
  const formattedResponse = formatResponse(author, maintainers, publishers);
}

function splitAuthorNameEmail(author) {
  const indexStartEmail = author.search(/[<]/g);
  const indexEndEmail = author.search(/[>]/g)
  if (!indexStartEmail && !indexEndEmail) {
    return author
  }
  return {
    name: author.substring(0, indexStartEmail).trim(),
    email: author.substring(indexStartEmail, indexEndEmail).trim()
  }
}

// Format response
function formatResponse(author, maintainers, publishers) {
  const authors = [];

  const objectAuthor = (name) => {
    return {
      name,
      email: '',
    };
  }

  for (const item of author) {
    if ('email' in item) {
      authors.push(splitAuthorNameEmail(item))
    } else {
      authors.push(objectAuthor(item))
    }
  }
}

// Import Internal Dependencies
import { useLevenshtein } from "./levenshtein.js";

export function formatAuthors({ author, maintainers, publishers }) {
  const authors = [];

  if (author?.name !== undefined) {
    authors.push(splitAuthorNameEmail(author));
  }
  iterateOver(maintainers, authors);
  iterateOver(publishers, authors);

  return useLevenshtein(authors);
}

export function iterateOver(iterable, arrayAuthors) {
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

export function splitAuthorNameEmail(author) {
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

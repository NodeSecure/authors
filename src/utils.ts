// // Import Internal Dependencies
import { useLevenshtein } from "./levenshtein.js";

// Import Third-party Dependencies
import { Maintainer } from "@npm/types";
import { Scanner } from "@nodesecure/scanner";

type MaintainerBis = { name: string, email: string };

export interface FormatAuthorsOptions {
  author: Maintainer;
  maintainers: MaintainerBis[];
  publishers: Scanner.Publisher[];
}

export interface FormattedAuthor {
  name: string;
  email?: string;
  version?: string;
  at?: string;
}

export function formatAuthors(
  options: FormatAuthorsOptions
) {
  const { author, maintainers, publishers } = options;

  const authors: FormattedAuthor[] = [];
  const extractedAuthor = splitAuthorNameEmail(author);
  if (extractedAuthor !== null) {
    authors.push(extractedAuthor);
  }

  iterateOver(maintainers, authors);
  iterateOver(publishers, authors);

  return useLevenshtein(authors);
}

export function iterateOver(
  iterable: (MaintainerBis | Scanner.Publisher)[],
  arrayAuthors: FormattedAuthor[]
) {
  for (const contributor of iterable) {
    const index = arrayAuthors.findIndex((el) => el.name === contributor.name);

    if (index === -1) {
      arrayAuthors.push(contributor);
      continue;
    }

    const currAuthor = arrayAuthors[index];
    if (
      currAuthor.email && currAuthor.name &&
      ("at" in contributor && "version" in contributor)
    ) {
      currAuthor.at = contributor.at;
      currAuthor.version = contributor.version;
    }
    else {
      arrayAuthors[index] = contributor;
    }
  }
}

export function splitAuthorNameEmail(
  author: Maintainer
): FormattedAuthor | null {
  if (typeof author === "string") {
    const indexStartEmail = author.search(/[<]/g);
    const indexEndEmail = author.search(/[>]/g);

    if (indexStartEmail === -1 && indexEndEmail === -1) {
      return { name: author };
    }

    return {
      name: author.slice(0, indexStartEmail).trim(),
      email: author.slice(indexStartEmail, indexEndEmail).trim()
    };
  }

  return "name" in author ?
    { name: author.name!, email: author.email! } :
    null;
}

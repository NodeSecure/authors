// Import Third-party Dependencies
import { Scanner } from "@nodesecure/scanner";

// Import Internal Dependencies
// import { DomainResolver } from "./domains.js";
// import { useLevenshtein } from "./levenshtein.js";
import * as utils from "./utils.js";

export interface ExtractedAuthor {
  name: string;
  email?: string;
}

export interface ExtractOptions {
  flaggedAuthors: ExtractedAuthor[],
  domainInformations: boolean,
}

export interface ExtractResult {
  authors: RegistryAuthor[],
  flaggedAuthors: ExtractedAuthor[],
}

export interface RegistryAuthor {
  name: string;
  email?: string;
  url?: string;
  packages: {
    homepage: string,
    spec: string,
    version?: string,
    at?: string,
  }[],
  domain?: {
    expirationDate?: string,
    mxRecords?: unknown[],
  }
}

export async function extractAllAuthors(
  library: Scanner.Payload,
  opts: ExtractOptions = { flaggedAuthors: [], domainInformations: false }
): Promise<any> {
  if (!("dependencies" in library)) {
    throw new Error("You must provide a list of dependencies");
  }

  const authors: RegistryAuthor[] = [];
  for (const [packageName, packageDependency] of Object.entries(library.dependencies)) {
    const { author, maintainers, publishers } = packageDependency.metadata;

    const authorsFound = utils.formatAuthors({
      author, maintainers, publishers
    });
    const packageMeta = {
      homepage: packageDependency.metadata.homepage ?? "",
      spec: packageName,
      versions: packageDependency.metadata.lastVersion
    };

    for (const author of authorsFound) {
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
  console.log(JSON.stringify(authors, null, 2));

  // if (authors.length === 0) {
  //   return {
  //     flaggedAuthors: [],
  //     authors: []
  //   };
  // }

  // const flaggedAuthors = Array.from(findFlaggedAuthors(
  //   useLevenshtein(authors),
  //   opts.flaggedAuthors
  // ));
  // if (opts.domainInformations) {
  //   await addDomainInformations(authors);
  // }

  // return {
  //   flaggedAuthors,
  //   authors
  // };
}

// async function addDomainInformations(authors) {
//   const domainResolver = new DomainResolver();
//   for (const author of authors) {
//     if (author.email === "") {
//       continue;
//     }
//     const domain = author.email.split("@")[1];

//     if (domain) {
//       author.domain = await domainResolver.resolve(domain);
//     }
//   }

//   return authors;
// }

// function* findFlaggedAuthors(
//   authors: RegistryAuthor[],
//   flaggedAuthors: ExtractedAuthor[] = []
// ): IterableIterator<{ name: string, email: string }> {
//   for (const author of authors) {
//     for (const flaggedAuthor of flaggedAuthors) {
//       if (flaggedAuthor.name === author.name || flaggedAuthor.email === author.email) {
//         yield { name: author.name, email: author.email };
//       }
//     }
//   }
// }

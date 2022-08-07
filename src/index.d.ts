// Import Third-party Dependencies
import { Maintainer } from "@npm/types";
import { Scanner } from "@nodesecure/scanner";

export function extractAllAuthorsFromLibrary(library: Scanner.Payload, flags: flagAuthor[] | null): Promise<authorsResponse>

export interface authorsResponse {
  authors: Maintainer[] | [],
  flags: flagAuthor[] | []
}
export interface flagAuthor {
  name: string,
  email: string,
}

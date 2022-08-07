// Import Third-party Dependencies
import { Scanner } from "@nodesecure/scanner";

export function extractAllAuthorsFromLibrary(library: Scanner.Payload, opts: options): Promise<authorsResponse[]>

export interface options {
  flags: flagAuthor[],
  domainInformations: boolean,
}

export interface authorsResponse {
  name?: string;
  email?: string;
  url?: string;
  flagged: boolean,
  packages: unknown[],
  expirationDate: string,
  mxRecords: unknown[],
}
export interface flagAuthor {
  name: string,
  email: string,
}

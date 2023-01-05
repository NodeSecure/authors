// Import Third-party Dependencies
import { Scanner } from "@nodesecure/scanner";

export function extractAllAuthorsFromLibrary(library: Scanner.Payload, opts: options): Promise<authorResponse[] | []>

export interface options {
  flags: flagAuthor[],
  domainInformations: boolean,
}

export interface authorResponse {
  name?: string;
  email?: string;
  url?: string;
  flagged: boolean,
  packages: unknown[],
  domain?: {
    expirationDate?: string,
    mxRecords?: unknown[],
  }
}
export interface flagAuthor {
  name: string,
  email: string,
}

// Import Third-party Dependencies
import { Scanner } from "@nodesecure/scanner";

export function extractAllAuthorsFromLibrary(library: Scanner.Payload, opts: options): Promise<response>

export interface options {
  flags: flaggedAuthors[],
  domainInformations: boolean,
}

export interface response {
  authors: authorResponse[],
  flaggedAuthors: flaggedAuthors[],
}

export interface authorResponse {
  name?: string;
  email?: string;
  url?: string;
  packages: {
    homepage: string,
    spec: string,
    version: string,
    at?: string,
  }[],
  domain?: {
    expirationDate?: string,
    mxRecords?: unknown[],
  }
}
export interface flaggedAuthors {
  name: string,
  email: string,
}

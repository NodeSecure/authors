// Import Third-party Dependencies
import { Scanner } from "@nodesecure/scanner";

export function extractAllAuthors(library: Scanner.Payload, opts: options): Promise<extractionResult>

export interface options {
  flaggedAuthors: extractedAuthor[],
  domainInformations: boolean,
}

export interface extractionResult {
  authors: author[],
  flaggedAuthors: extractedAuthor[],
}

export interface author {
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
export interface extractedAuthor {
  name: string,
  email: string,
}

// Import Third-party Dependencies
import { Scanner } from "@nodesecure/scanner";

export function extractAllAuthors(library: Scanner.Payload, opts: options): Promise<extractionResult>

export interface options {
  flags: extractedAuthor[],
  domainInformations: boolean,
}

export interface extractionResult {
  authors: author[],
  flaggedAuthors: extractedAuthor[],
}

export type Package = Record<string, any> & {
  havePublishRecently: boolean;
  hasBeenActiveOnGithubRepo: boolean | null;
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
  hasBeenActiveOnGithub: boolean | null;
  domain?: {
    expirationDate?: string;
    mxRecords?: string[];
  }
}
export interface extractedAuthor {
  name: string,
  email: string,
}

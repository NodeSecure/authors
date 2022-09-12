// Import Third-party Dependencies
import { Scanner } from "@nodesecure/scanner";

export function extractAllAuthorsFromLibrary(library: Scanner.Payload, opts: ExtractAllAuthorsFromLibraryOptions): Promise<AuthorResponse[]>

export interface ExtractAllAuthorsFromLibraryOptions {
  flags: FlagAuthor[],
  domainInformations: boolean,
}

export type Package = Record<string, any> & {
  havePublishRecently: boolean;
  hasBeenActiveOnGithubRepo: boolean | null;
}

export interface AuthorResponse {
  name?: string;
  email?: string;
  url?: string;
  flagged: boolean;
  packages: Package[];
  hasBeenActiveOnGithub: boolean | null;
  domain?: {
    expirationDate?: string;
    mxRecords?: string[];
  }
}

export interface FlagAuthor {
  name: string;
  email: string;
}

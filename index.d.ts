// Import Third-party Dependencies
import { Maintainer } from "@npm/types";
import { Scanner } from "@nodesecure/scanner";

export function extractAndOptimizeUsers(maintainers: Maintainer): Maintainer[] | [];
export function extractAllAuthorsFromLibrary(library: Scanner.Payload): Maintainer[] | [];

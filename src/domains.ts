// Import Node.js Dependencies
import dns from "node:dns/promises";

// Import Third-party Dependencies
import { Some, None, Option } from "@openally/result";

// Import Internal Dependencies
import { whois } from "./utils/whois.js";

export type DnsNotFound = {
  state: "not found";
}

export type DnsResolved = { state: "not found" } | {
  state: "expired" | "active";
  expirationDate: string | null;
  mxRecords: string[];
}

export type ResolveResult = DnsNotFound | DnsResolved;

export class DomainResolver {
  #cache: Map<string, DnsResolved> = new Map();

  async resolve(
    domain: string
  ): Promise<ResolveResult> {
    if (this.#cache.has(domain)) {
      return this.#cache.get(domain)!;
    }

    const mxRecords = await safeResolveMx(domain);
    if (mxRecords.none) {
      return {
        state: "not found"
      };
    }

    const expirationDate = await whois(domain);
    const result: DnsResolved = {
      state: expirationDate === null ? "expired" : "active",
      expirationDate,
      mxRecords: mxRecords.safeUnwrap()
    };
    this.#cache.set(domain, result);

    return result;
  }

  clear() {
    this.#cache.clear();
  }
}

async function safeResolveMx(domain: string): Promise<Option<string[]>> {
  try {
    const mxRecords = await dns.resolveMx(domain);

    return Some(
      mxRecords.map(({ exchange }) => exchange)
    );
  }
  catch {
    return None;
  }
}

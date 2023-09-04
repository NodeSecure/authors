// Import Node.js Dependencies
import dns from "node:dns/promises";

// Import Third-party Dependencies
import { Some, None } from "@openally/result";

// Import Internal Dependencies
import { whois } from "./whois.js";

// VARS
export const DOMAINS_CACHE = new Map();

export async function getDomainInformations(domain) {
  if (DOMAINS_CACHE.has(domain)) {
    return DOMAINS_CACHE.get(domain);
  }

  const mxRecords = await safeResolveMx(domain);
  if (mxRecords.none) {
    return {
      state: "not found"
    };
  }

  const expirationDate = await whois(domain);
  const result = {
    state: expirationDate === null ? "expired" : "active",
    expirationDate,
    mxRecords: mxRecords.safeUnwrap()
  };
  DOMAINS_CACHE.set(domain, result);

  return result;
}

async function safeResolveMx(domain) {
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

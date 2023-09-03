// Import Node.js Dependencies
import dns from "node:dns/promises";

// Import Third-party Dependencies
import { Ok, Err } from "@openally/result";

export async function resolveMxRecords(domain) {
  try {
    const mxRecords = await dns.resolveMx(domain);

    return Ok(
      mxRecords.map(({ exchange }) => exchange)
    );
  }
  catch (error) {
    return Err(error);
  }
}

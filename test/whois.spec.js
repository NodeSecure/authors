// Import Node.js Dependencies
import { describe, it } from "node:test";
import assert from "node:assert";

// Import Internal Dependencies
import { whois } from "../src/whois.js";

function isValidDate(dateString) {
  return dateString.match(/^\d{4}-\d{2}-\d{2}/) !== null;
}

describe("whois", () => {
  it("should resolve domain expiration date for 'google.com'", async() => {
    // Given
    const domain = "google.com";

    // When
    const domainExpirationDate = await whois(domain);

    // Then
    assert.ok(isValidDate(domainExpirationDate));
  });
});

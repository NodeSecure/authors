// Import Node.js Dependencies
import { describe, it } from "node:test";
import assert from "node:assert";

// Import Internal Dependencies
import { getDomainInformations } from "../src/domains.js";

function isValidDate(dateString) {
  return dateString.match(/^\d{4}-\d{2}-\d{2}/) !== null;
}

describe("getDomainInformations", () => {
  it("should fetch/get domain informations for google.com", async() => {
    const domain = "google.com";

    const infos = await getDomainInformations(domain);

    assert.strict(infos.state, "active");
    assert.ok(isValidDate(infos.expirationDate));
    assert.ok(Array.isArray(infos.mxRecords));
    assert.strictEqual(infos.mxRecords[0], "smtp.google.com");
  });

  it("should return state equal 'not found' for an unknown domain", async() => {
    const domain = "zbvoepokxfkxlzkejnckekjx.ru";

    const infos = await getDomainInformations(domain);
    assert.strict(infos.state, "not found");
  });
});

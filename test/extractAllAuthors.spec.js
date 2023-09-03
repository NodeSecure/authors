// Import Node.js Dependencies
import { test } from "node:test";
import assert from "node:assert";
import { readFileSync } from "node:fs";

// Import Internal Dependencies
import { extractAllAuthors } from "../index.js";

// CONSTANTS
const kFixtureNodeSecurePayload = JSON.parse(
  readFileSync(
    new URL("./fixtures/nsecure-result.json", import.meta.url)
  )
);

test("All authors from library without flags involved", async() => {
  const res = await extractAllAuthors(kFixtureNodeSecurePayload, {
    flags: [],
    domainInformations: true
  });

  assert.ok(res.authors.length > 0, "There should be authors in the response");
});

test("test authors from library with flag", async() => {
  const flaggedAuthors = [
    { name: "kesla", email: "david.bjorklund@gmail.com" }
  ];
  const res = await extractAllAuthors(kFixtureNodeSecurePayload, {
    flaggedAuthors
  });

  assert.deepEqual(res.authorsFlagged, flaggedAuthors);
  assert.deepEqual(res.authors.slice(1, 2),
    [
      {
        name: "kesla",
        email: "david.bjorklund@gmail.com",
        packages:
          [
            {
              homepage: "https://github.com/jshttp/etag#readme",
              spec: "etag",
              versions: "1.8.1",
              at: "2014-05-18T11:14:58.281Z"
            }
          ]
      }
    ]
  );
});

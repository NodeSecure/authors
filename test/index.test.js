/* eslint-disable max-len */
// Import Node.js Dependencies
import { readFile } from "fs/promises";
import { test } from "node:test";
import assert from "node:assert";

// Import Internal Dependencies
import { extractAllAuthors } from "../src/index.js";

const nsecureTestFile = JSON.parse(
  await readFile(
    new URL("./nsecure-result.json", import.meta.url)
  )
);

test("All authors from library without flags involved", async() => {
  const packageTest = nsecureTestFile;

  const res = await extractAllAuthors(packageTest, { flags: [], domainInformations: true });
  assert.notEqual(res.length, 0);
});

test("test authors from library with flag", async() => {
  const packageTest = nsecureTestFile;
  const flaggedAuthors = [
    { name: "kesla", email: "david.bjorklund@gmail.com" }
  ];
  const res = await extractAllAuthors(packageTest, {
    flags: flaggedAuthors
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

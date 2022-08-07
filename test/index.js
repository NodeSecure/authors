/* eslint-disable max-len */
// Import Node.js Dependencies
import { readFile } from "fs/promises";

// Import Third-party Dependencies
import test from "tape";

// Import Internal Dependencies
import { extractAllAuthorsFromLibrary } from "../src/index.js";

const nsecureTestFile = JSON.parse(
  await readFile(
    new URL("./nsecure-result.json", import.meta.url)
  )
);

test("All authors from library without flags involved", async(tape) => {
  const packageTest = nsecureTestFile;

  const authors = await extractAllAuthorsFromLibrary(packageTest);

  tape.isNot(authors.length, 0, "There should be authors in the response");
  tape.end();
});

test("test authors from library with flag", async(tape) => {
  const packageTest = nsecureTestFile;
  const flaggedAuthors = [
    { name: "Blakeembrey", email: "hello@blakeembrey.com" }
  ];
  const authors = await extractAllAuthorsFromLibrary(packageTest, flaggedAuthors);
  tape.deepEqual(authors.slice(0, 1), [{
    name: "Blake Embrey",
    email: "hello@blakeembrey.com",
    flagged: true,
    packages: [
      {
        homepage: "https://github.com/blakeembrey/array-flatten",
        spec: "array-flatten",
        versions: "3.0.0",
        isPublishers: false
      },
      {
        homepage: "https://github.com/pillarjs/path-to-regexp#readme",
        spec: "path-to-regexp",
        versions: "6.2.0",
        isPublishers: true
      }
    ]
  }]);
  tape.end();
});

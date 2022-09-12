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

  const authors = await extractAllAuthorsFromLibrary(packageTest, { flags: [], domainInformations: true });

  tape.isNot(authors.length, 0, "There should be authors in the response");
  tape.end();
});

test("test authors from library with flag", async(tape) => {
  const packageTest = nsecureTestFile;
  const flaggedAuthors = [
    { name: "Blakeembrey", email: "hello@blakeembrey.com" }
  ];
  const authors = await extractAllAuthorsFromLibrary(packageTest, {
    flags: flaggedAuthors
  });
  tape.deepEqual(authors.slice(4, 5), [{
    name: "Blake Embrey",
    email: "hello@blakeembrey.com",
    flagged: true,
    packages: [
      {
        homepage: "https://github.com/blakeembrey/array-flatten",
        spec: "array-flatten",
        versions: "3.0.0",
        isPublishers: false,
        havePublishRecently: false,
        hasBeenActiveOnGithubRepo: null
      },
      {
        homepage: "https://github.com/pillarjs/path-to-regexp#readme",
        spec: "path-to-regexp",
        versions: "6.2.1",
        isPublishers: true,
        havePublishRecently: true,
        hasBeenActiveOnGithubRepo: false
      }
    ],
    hasBeenActiveOnGithub: true
  }]);
  tape.end();
});

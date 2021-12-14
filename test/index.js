// Import Node.js Dependencies
import { readFile } from "fs/promises";

// Import Third-party Dependencies
import test from "tape";

// Import Internal Dependencies
import { extractAllAuthorsFromLibrary, extractAndOptimizeUsers } from "../src/index.js";

const nsecureTestFile = JSON.parse(
  await readFile(
    new URL("./nsecure-result.json", import.meta.url)
  )
);

test("check author is splitted correctly", (tape) => {
  const packageTest = nsecureTestFile.dependencies.cookie;

  const authors = extractAndOptimizeUsers(packageTest.metadata);
  tape.deepEqual(authors, [
    { name: "Roman Shtylman", email: "shtylman@gmail.com", version: "0.1.2", at: "2014-04-16T23:00:21.566Z" },
    { name: "dougwilson", email: "doug@somethingdoug.com" }
  ]);
  tape.end();
});

test("There is no duplicate authors in response", (tape) => {
  const packageTest = nsecureTestFile.dependencies.etag;

  const authors = extractAndOptimizeUsers(packageTest.metadata);
  tape.deepEqual(authors, [
    { name: "dougwilson", email: "doug@somethingdoug.com" },
    { name: "kesla", email: "david.bjorklund@gmail.com", version: "1.0.0", at: "2014-05-18T11:14:58.281Z" }
  ]);
  tape.end();
});

test("Test path-to-regexp package => duplicate email", (tape) => {
  const packageTest = nsecureTestFile.dependencies["path-to-regexp"];

  const authors = extractAndOptimizeUsers(packageTest.metadata);
  tape.deepEqual(authors, [
    { name: "blakeembrey", email: "hello@blakeembrey.com" },
    { name: "dougwilson", email: "doug@somethingdoug.com" },
    { name: "jongleberry", email: "jonathanrichardong@gmail.com" },
    { name: "defunctzombie", email: "shtylman@gmail.com" },
    { name: "tjholowaychuk", email: "tj@vision-media.ca", version: "0.0.2", at: "2013-02-10T17:41:48.985Z" }
  ]);
  tape.end();
});

test("All authors from library", (tape) => {
  const packageTest = nsecureTestFile;

  const authors = extractAllAuthorsFromLibrary(packageTest);
  tape.deepEqual(authors.slice(0, 3), [
    { name: "ljharb", email: "ljharb@gmail.com" },
    { name: "nlf", email: "quitlahok@gmail.com" },
    { name: "hueniverse", email: "eran@hammer.io", version: "6.0.0", at: "2015-11-03T03:02:36.639Z" }
  ]);
  tape.end();
});

test("All authors should return empty array", (tape) => {
  const packageTest = {};

  const authors = extractAllAuthorsFromLibrary(packageTest);
  tape.deepEqual(authors, []);

  const authors2 = extractAllAuthorsFromLibrary();
  tape.deepEqual(authors2, []);
  tape.end();
});

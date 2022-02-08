/* eslint-disable max-len */
// Import Node.js Dependencies
import { cp } from "fs";
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

  const { authors } = extractAndOptimizeUsers(packageTest.metadata);
  tape.deepEqual(authors, [
    { name: "Roman Shtylman", email: "shtylman@gmail.com", version: "0.1.2", at: "2014-04-16T23:00:21.566Z" },
    { name: "dougwilson", email: "doug@somethingdoug.com" }
  ]);
  tape.end();
});

test("There is no duplicate authors in response", (tape) => {
  const packageTest = nsecureTestFile.dependencies.etag;

  const { authors } = extractAndOptimizeUsers(packageTest.metadata);
  tape.deepEqual(authors, [
    { name: "dougwilson", email: "doug@somethingdoug.com" },
    { name: "kesla", email: "david.bjorklund@gmail.com", version: "1.0.0", at: "2014-05-18T11:14:58.281Z" }]);
  tape.end();
});

test("Test path-to-regexp package => duplicate email", (tape) => {
  const packageTest = nsecureTestFile.dependencies["path-to-regexp"];

  const { authors } = extractAndOptimizeUsers(packageTest.metadata);
  tape.deepEqual(authors, [
    { name: "blakeembrey", email: "hello@blakeembrey.com" },
    { name: "dougwilson", email: "doug@somethingdoug.com" },
    { name: "jongleberry", email: "jonathanrichardong@gmail.com" },
    { name: "defunctzombie", email: "shtylman@gmail.com" },
    { name: "tjholowaychuk", email: "tj@vision-media.ca", version: "0.0.2", at: "2013-02-10T17:41:48.985Z" }]);
  tape.end();
});

test("All authors from library", (tape) => {
  const packageTest = nsecureTestFile;

  const { authors } = extractAllAuthorsFromLibrary(packageTest);
  tape.deepEqual(authors.slice(0, 3), [
    { name: "Blake Embrey", email: "hello@blakeembrey.com", packageName: "array-flatten" },
    { name: "Roman Shtylman", email: "shtylman@gmail.com", packageName: "cookie", version: "4.0.0", at: "2014-04-09T20:39:26.853Z" },
    { name: "Douglas Christopher Wilson", email: "doug@somethingdoug.com" }]);
  tape.end();
});

test("All authors should return empty array", (tape) => {
  const packageTest = {};

  const { authors } = extractAllAuthorsFromLibrary(packageTest);
  tape.deepEqual(authors, undefined);

  const authors2 = extractAllAuthorsFromLibrary();
  tape.deepEqual(authors2.authors, undefined);
  tape.end();
});

test("Should return authors + flagAuthors not empty", (tape) => {
  const packageTest = nsecureTestFile;

  const flagsAuthor = [
    { name: "Blake Embrey", email: "hello@blakeembrey.com" }
  ];

  const { authors, flags } = extractAllAuthorsFromLibrary(packageTest, flagsAuthor);
  tape.deepEqual(authors.slice(0, 3), [
    { name: "Blake Embrey", email: "hello@blakeembrey.com", packageName: "array-flatten" },
    { name: "Roman Shtylman", email: "shtylman@gmail.com", packageName: "cookie", version: "4.0.0", at: "2014-04-09T20:39:26.853Z" },
    { name: "Douglas Christopher Wilson", email: "doug@somethingdoug.com", packageName: "cookie", version: "0.4.2", at: "2022-02-02T23:29:30.095Z" }
  ]);
  tape.deepEqual(flags, [
    { name: "Blake Embrey", email: "hello@blakeembrey.com", packageName: "array-flatten" }
  ]);
  tape.end();
});

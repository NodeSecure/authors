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

test("check author is splitted correctly", async(tape) => {
  const packageTest = nsecureTestFile.dependencies.cookie;

  const authors = await extractAndOptimizeUsers(packageTest.metadata);
  tape.deepEqual(authors, [
    { name: "Roman Shtylman", email: "shtylman@gmail.com" },
    { name: "dougwilson", email: "doug@somethingdoug.com" }
  ]);
  tape.end();
});

test("There is no duplicate authors in response", async(tape) => {
  const packageTest = nsecureTestFile.dependencies.etag;

  const authors = await extractAndOptimizeUsers(packageTest.metadata);
  tape.deepEqual(authors, [
    { name: "dougwilson", email: "doug@somethingdoug.com" },
    { name: "kesla", email: "david.bjorklund@gmail.com", version: "1.0.0", at: "2014-05-18T11:14:58.281Z" }
  ]);
  tape.end();
});

test("Test path-to-regexp package => duplicate email", async(tape) => {
  const packageTest = nsecureTestFile.dependencies["path-to-regexp"];

  const authors = await extractAndOptimizeUsers(packageTest.metadata);
  tape.deepEqual(authors, [
    { name: "blakeembrey", email: "hello@blakeembrey.com" },
    { name: "dougwilson", email: "doug@somethingdoug.com" },
    { name: "jongleberry", email: "jonathanrichardong@gmail.com" },
    { name: "defunctzombie", email: "shtylman@gmail.com" },
    { name: "tjholowaychuk", email: "tj@vision-media.ca", version: "0.0.2", at: "2013-02-10T17:41:48.985Z" }
  ]);
  tape.end();
});

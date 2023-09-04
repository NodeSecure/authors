// Import Node.js Dependencies
import { test } from "node:test";
import assert from "node:assert";

// Import Internal Dependencies
import { isSimilar, separateWord, useLevenshtein } from "../src/levenshtein.js";

test("check separateWord", () => {
  const author = "Vincent Dhennin";
  const author2 = "poppins,virk";

  const data = separateWord(author);
  assert.deepEqual(data, [
    "Vincent",
    "Dhennin"
  ]);

  const data2 = separateWord(author2);
  assert.deepEqual(data2, [
    "poppins",
    "virk"
  ]);
});

test("check isSimilar about email", () => {
  const author1 = "shtylman@gmail.com";
  const author2 = "doug@somethingdoug.com";

  const similar = isSimilar(author1, author2);
  assert.equal(similar, 16);

  const author3 = "shtylman@gmail.com";
  const author4 = "shtylman@gmail.com";

  const similar2 = isSimilar(author3, author4);
  assert.equal(similar2, 0);
});

test("check isSimilar about names", () => {
  const author1 = "Roman Shtylman";
  const author2 = "doug@somethingdoug.com";

  const similar = isSimilar(author1, author2);
  assert.equal(similar, 19);
});

test("useLevenshtein on authors list", () => {
  const authors = [
    { name: "Roman Shtylman", email: "shtylman@gmail.com" },
    { name: "dougwilson", email: "doug@somethingdoug.com" },
    { name: "shtylman", email: "shtylman@gmail.com" }
  ];
  const authorsFormatted = useLevenshtein(authors);
  assert.deepEqual(authorsFormatted, [
    { name: "Roman Shtylman", email: "shtylman@gmail.com" },
    { name: "dougwilson", email: "doug@somethingdoug.com" }
  ]);
});

test("useLevenshtein on authors list containing duplicate email", () => {
  const authors = [
    { name: "Roman Shtylman", email: "shtylman@gmail.com" },
    { name: "dougwilson", email: "doug@somethingdoug.com" },
    { name: "shtylman", email: "shtylman@gmail.com" }
  ];
  const authorsFormatted = useLevenshtein(authors);
  assert.deepEqual(authorsFormatted, [
    { name: "Roman Shtylman", email: "shtylman@gmail.com" },
    { name: "dougwilson", email: "doug@somethingdoug.com" }
  ]);
});

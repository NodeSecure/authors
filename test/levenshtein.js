// Import Third-party Dependencies
import test from "tape";

// Import Internal Dependencies
import { isSimilar, separateWord, useLevenshtein } from "../src/levenshtein.js";

test("check separateWord", (tape) => {
  const author = "Vincent Dhennin";
  const author2 = "poppins,virk";

  const data = separateWord(author);
  tape.deepEqual(data, [
    "Vincent",
    "Dhennin"
  ]);

  const data2 = separateWord(author2);
  tape.deepEqual(data2, [
    "poppins",
    "virk"
  ]);
  tape.end();
});

test("check isSimilar about email", (tape) => {
  const author1 = "shtylman@gmail.com";
  const author2 = "doug@somethingdoug.com";

  const similar = isSimilar(author1, author2);
  tape.equal(similar, 16);

  const author3 = "shtylman@gmail.com";
  const author4 = "shtylman@gmail.com";

  const similar2 = isSimilar(author3, author4);
  tape.equal(similar2, 0);
  tape.end();
});

test("check isSimilar about names", (tape) => {
  const author1 = "Roman Shtylman";
  const author2 = "doug@somethingdoug.com";

  const similar = isSimilar(author1, author2);
  tape.equal(similar, 19);
  tape.end();
});

test("useLevenshtein on authors list", (tape) => {
  const authors = [
    { name: "Roman Shtylman", email: "shtylman@gmail.com" },
    { name: "dougwilson", email: "doug@somethingdoug.com" },
    { name: "shtylman", email: "shtylman@gmail.com", version: "0.1.2", at: "2014-04-16T23:00:21.566Z" }
  ];
  const authorsFormatted = useLevenshtein(authors);
  tape.deepEqual(authorsFormatted, [
    { name: "Roman Shtylman", email: "shtylman@gmail.com", version: "0.1.2", at: "2014-04-16T23:00:21.566Z" },
    { name: "dougwilson", email: "doug@somethingdoug.com" }
  ]);
  tape.end();
});

test("useLevenshtein on authors list containing duplicate email", (tape) => {
  const authors = [
    { name: "Roman Shtylman", email: "shtylman@gmail.com" },
    { name: "dougwilson", email: "doug@somethingdoug.com" },
    { name: "shtylman", email: "shtylman@gmail.com", version: "0.1.2", at: "2014-04-16T23:00:21.566Z" }
  ];
  const authorsFormatted = useLevenshtein(authors);
  tape.deepEqual(authorsFormatted, [
    { name: "Roman Shtylman", email: "shtylman@gmail.com", version: "0.1.2", at: "2014-04-16T23:00:21.566Z" },
    { name: "dougwilson", email: "doug@somethingdoug.com" }
  ]);
  tape.end();
});

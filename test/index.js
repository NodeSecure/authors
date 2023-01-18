/* eslint-disable max-len */
// Import Node.js Dependencies
import { readFile } from "fs/promises";

// Import Third-party Dependencies
import test from "tape";

// Import Internal Dependencies
import { extractAllAuthors } from "../src/index.js";

const nsecureTestFile = JSON.parse(
  await readFile(
    new URL("./nsecure-result.json", import.meta.url)
  )
);

test("All authors from library without flags involved", async(tape) => {
  const packageTest = nsecureTestFile;

  const res = await extractAllAuthors(packageTest, { flags: [], domainInformations: true });

  tape.isNot(res.authors.length, 0, "There should be authors in the response");
  tape.end();
});

test("test authors from library with flag", async(tape) => {
  const packageTest = nsecureTestFile;
  const flaggedAuthors = [
    { name: "kesla", email: "david.bjorklund@gmail.com" }
  ];
  const res = await extractAllAuthors(packageTest, {
    flags: flaggedAuthors
  });

  tape.deepEqual(res.authorsFlagged, flaggedAuthors);
  tape.deepEqual(res.authors.slice(1, 2),
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
  tape.end();
});

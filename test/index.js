// Import Node.js Dependencies
import { readFile } from "fs/promises";

// Import Third-party Dependencies
import test from "tape";

// Import Internal Dependencies
import { extractAndOptimizeUsers } from "../src/index.js";

const nsecureTestFile = JSON.parse(
  await readFile(
    new URL("./nsecure-result.json", import.meta.url)
  )
);

test("should passed", (tape) => {
  for (const dep of Object.values(nsecureTestFile)) {
    for (const meta of Object.values(dep)) {
      const authors = extractAndOptimizeUsers(meta.metadata);
      console.log(authors);
    }
  }
  tape.end();
});

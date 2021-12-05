import { from } from "@nodesecure/scanner";
import { writeFileSync } from "fs";

async function main() {
  const result = await from("express", {
    maxDepth: 10
  });

  writeFileSync("./test/nsecure-result.json", JSON.stringify(result, null, 2));
}
main().catch(console.error);

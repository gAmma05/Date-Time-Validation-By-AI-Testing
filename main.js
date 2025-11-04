import { generateDateTimeTests } from "./ai/testGenerator.js";
import { runTests } from "./runner/testRunner.js";

async function main() {
  const tests = await generateDateTimeTests();
  console.log("🧠 Generated test cases:", tests);

  const results = runTests(tests);
  console.log("🧪 Results:", results);
}

main();

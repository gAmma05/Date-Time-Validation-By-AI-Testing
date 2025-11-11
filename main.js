import { generateDateTimeTests } from "./ai/testGenerator.js";
import { runTests } from "./runner/testRunner.js";

async function main() {
  console.log("🚀 Generating AI-based test cases...");
  const testCases = await generateDateTimeTests();

  console.log("🧪 Running tests...");
  const results = await runTests(testCases);

  console.table(results);
}

main();

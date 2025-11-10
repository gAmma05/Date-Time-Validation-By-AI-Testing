import { validateDateTime } from "../validator/dateValidator.js";
import fs from "fs";

export function runTests(testCases) {
  const results = [];

  for (const { input, expected } of testCases) {
    const actual = validateDateTime(input);
    const passed = expected === actual;

    results.push({ input, expected, actual, passed });
  }

  // Ghi log để AI học lần sau
  fs.writeFileSync("testResults.json", JSON.stringify(results, null, 2));
  console.log("✅ Test completed. Results saved to testResults.json");

  return results;
}

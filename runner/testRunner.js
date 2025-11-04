import { validateDateTime } from "../validator/dateValidator.js";

export function runTests(testCases) {
  const results = [];
  for (const { input, expected } of testCases) {
    const actual = validateDateTime(input);
    results.push({
      input,
      expected,
      actual,
      passed: expected === actual
    });
  }
  return results;
}

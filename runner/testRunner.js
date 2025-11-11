import { validateDateTime } from "../validator/dateValidator.js"; // Đảm bảo đường dẫn đúng
import fs from "fs";

export async function runTests(testCases) {
  const results = [];
  console.log("🚀 Starting tests with AI self-healing...");

  for (const { input, expected } of testCases) {
    // Dòng này không cần thay đổi, vì bạn đã dùng await
    const actual = await validateDateTime(input);
    const passed = expected === actual;

    results.push({ input, expected, actual, passed });
  }

  fs.writeFileSync("testResults.json", JSON.stringify(results, null, 2));
  console.log("✅ Test completed. Results saved to testResults.json");
  console.log("📄 Check formats.json to see if AI learned new formats!");

  return results;
}
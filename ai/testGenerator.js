import { askGemini } from "./geminiClient.js";

export async function generateDateTimeTests() {
  const prompt = `
  Generate 10 test cases for a date/time validator.
  Each test case should include:
  - input: the date/time string
  - expected: whether it should be valid (true/false)
  Format output as JSON array only.
  `;

  for (let i = 0; i < 3; i++) { // tối đa 3 lần thử
    const text = await askGemini(prompt);
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      console.warn(`⚠️ Attempt ${i + 1} failed to parse AI output. Retrying...`);
    }
  }

  console.error("❌ AI failed to return valid JSON after 3 attempts.");
  return [];
}

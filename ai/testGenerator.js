import { askGemini } from "./geminiClient.js";

export async function generateDateTimeTests() {
  const prompt = `
  Generate 10 test cases for a date/time validator.
  Each test case should include:
  - input: the date/time string
  - expected: whether it should be valid (true/false)
  Format output as JSON array only. Do NOT include markdown formatting.
  `;
  
  const text = await askGemini(prompt);

  // ✂️ Clean output (remove ```json, ``` and whitespace)
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ Failed to parse AI output:", cleaned);
    return [];
  }
}
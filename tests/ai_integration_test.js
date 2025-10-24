const assert = require('assert');

Feature('AI Integration');

Scenario('AI response for leap and non-leap years', async ({ I }) => {
  const leapYearDate = "2024-02-29";
  const nonLeapYearDate = "2025-02-29";

  // Test leap year
  const aiLeap = await I.askOpenAI(`Is ${leapYearDate} a valid date? Answer Yes or No only.`);
  I.say(`AI answered for ${leapYearDate}: ${aiLeap}`);
  assert.ok(aiLeap.toLowerCase().includes('yes'), `Expected "yes" but got "${aiLeap}"`);

  // Test non-leap year
  const aiNonLeap = await I.askOpenAI(`Is ${nonLeapYearDate} a valid date? Answer Yes or No only.`);
  I.say(`AI answered for ${nonLeapYearDate}: ${aiNonLeap}`);
  assert.ok(aiNonLeap.toLowerCase().includes('no'), `Expected "no" but got "${aiNonLeap}"`);
});

const assert = require('assert');

Feature('Date Validation');

Scenario('Valid date formats', async ({ I }) => {
  const validDates = ['2024-02-29', '2025-10-16', '2000-12-31'];
  for (const date of validDates) {
    const result = await I.isValidDate(date);
    assert.strictEqual(result, true);
    I.say(`${date} is ✅ valid`);
  }

});

Scenario('Invalid date formats', async ({ I }) => {
  const invalidDates = ['2025-13-01', 'abcd-ef-gh', '2025/10/16'];
  for (const date of invalidDates) {
    const result = await I.isValidDate(date);
    assert.strictEqual(result, false);
    I.say(`${date} is ❌ invalid`);
  }

});

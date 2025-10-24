const Helper = require('@codeceptjs/helper');
const axios = require('axios');

class AIHelper extends Helper {
  /**
   * Gửi prompt tới OpenAI API (hoặc Gemini nếu bạn đổi endpoint)
   */
  async askOpenAI(prompt) {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.choices[0].message.content.trim();
  }
}

module.exports = AIHelper;

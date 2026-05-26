const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a helpful customer support assistant for an online store that sells Electronics, Clothing, and Books.
Answer questions about products, orders, returns, and shipping.
Keep responses concise (2-4 sentences max).
If asked about something unrelated to the store or products, politely redirect.`;

// POST /api/chatbot/message
// BUG-05 (intentional): No timeout set on the Gemini API call.
// Slow API responses will leave the UI in a loading state indefinitely — a deliberate test scenario.
router.post('/message', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-lite-latest',
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: { maxOutputTokens: 200 },
    });

    const result = await model.generateContent(message);
    const reply = result.response.text();

    res.json({ reply });
  } catch (err) {
    console.error('Chatbot error:', err.message);
    res.status(500).json({ error: 'Chatbot is unavailable. Please try again later.' });
  }
});

module.exports = router;

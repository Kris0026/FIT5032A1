
const functions = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const cors = require('cors')({ origin: true }); 
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.aiAdvice = functions.onRequest(
  { region: 'australia-southeast1', timeoutSeconds: 60, memory: '256MiB' },
  async (req, res) => {
  
    cors(req, res, async () => {
      if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Headers', 'content-type');
        res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
        return res.status(204).send('');
      }

      try {
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method Not Allowed' });
        }

        const { age, rhr, goal } = req.body || {};
        if (!age || !rhr || !goal) {
          return res.status(400).json({ error: 'Missing fields: age, rhr, goal are required.' });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
You are a men's health coach. Give concise, practical advice in 3-5 bullet points.
User profile:
- Age: ${age}
- Resting heart rate: ${rhr} bpm
- Goal: ${goal}

Keep it safe, non-diagnostic, and action-oriented.`;

        const result = await model.generateContent(prompt);
        const text = result.response?.text() || 'No advice generated.';

        res.set('Access-Control-Allow-Origin', '*');
        return res.status(200).json({ advice: text });
      } catch (err) {
        logger.error('aiAdvice error', err);
        res.set('Access-Control-Allow-Origin', '*');
        return res.status(500).json({ error: 'internal', detail: String(err?.message || err) });
      }
    });
  }
);

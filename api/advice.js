import { readStorage } from './advice-storage.js';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function generateAdvice() {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content: "You are Dr. Hoot, a wise but quirky owl who gives nonsensical yet amusing life advice. Your advice should be funny, slightly absurd, but with a tiny grain of wisdom. Keep responses under 100 characters."
            }, {
                role: "user",
                content: "Give me one piece of life advice."
            }],
            max_tokens: 50,
            temperature: 0.8
        });

        if (completion.choices && completion.choices[0]) {
            return completion.choices[0].message.content.trim();
        }
        throw new Error('No advice generated');
    } catch (error) {
        console.error('Error generating advice:', error);
        throw error;
    }
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get the current advice (will be the same throughout the day)
        const stored = readStorage();
        return res.status(200).json(stored);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ 
            error: 'Failed to fetch advice',
            message: error.message
        });
    }
} 
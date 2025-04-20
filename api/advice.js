import { readStorage, writeStorage } from './advice-storage.js';

async function generateAdvice() {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
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
            })
        });

        const data = await response.json();
        if (data.choices && data.choices[0]) {
            return data.choices[0].message.content.trim();
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
        // First check if we have stored advice
        const stored = readStorage();
        if (stored.advice) {
            return res.status(200).json(stored);
        }

        // If no stored advice, generate new advice
        const advice = await generateAdvice();
        const timestamp = new Date().toISOString();

        // Store the new advice
        const success = writeStorage({ advice, timestamp });
        if (!success) {
            throw new Error('Failed to store advice');
        }

        return res.status(200).json({ advice, timestamp });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ 
            error: 'Failed to fetch advice',
            message: error.message
        });
    }
} 
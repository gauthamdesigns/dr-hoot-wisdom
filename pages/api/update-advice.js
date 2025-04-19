import fs from 'fs';
import path from 'path';

const ADVICE_FILE = path.join(process.cwd(), 'pages/api/advice.txt');

export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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
            const advice = data.choices[0].message.content.trim();
            fs.writeFileSync(ADVICE_FILE, `"${advice}"`);
            console.log('Advice updated successfully at', new Date().toISOString());
            return res.status(200).json({ success: true, message: 'Advice updated successfully' });
        } else {
            throw new Error('No advice generated');
        }
    } catch (error) {
        console.error('Error updating advice:', error);
        return res.status(500).json({ error: 'Failed to update advice' });
    }
} 
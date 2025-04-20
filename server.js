import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Serve static files
app.use(express.static('.'));

// API endpoint
app.get('/api/get-advice', async (req, res) => {
    const ADVICE_FILE = path.join(__dirname, 'pages/api/advice.txt');

    try {
        // Check if we need to update
        const shouldUpdate = req.query.update === 'true';
        
        if (shouldUpdate) {
            // Generate new advice
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
                return res.json({ advice: `"${advice}"` });
            }
        }

        // Read and return current advice
        const advice = fs.readFileSync(ADVICE_FILE, 'utf8');
        res.json({ advice });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to handle advice request' });
    }
});

app.listen(port, () => {
    console.log(`Test server running at http://localhost:${port}`);
}); 
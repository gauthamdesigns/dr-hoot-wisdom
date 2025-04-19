import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ADVICE_FILE = path.join(__dirname, 'pages/api/advice.txt');

async function generateAndStoreAdvice() {
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
            console.log('New advice:', advice);
            console.log('Stored in:', ADVICE_FILE);
        } else {
            console.log('No advice generated:', data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the test
generateAndStoreAdvice(); 
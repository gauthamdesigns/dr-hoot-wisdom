import fs from 'fs';
import path from 'path';

const ADVICE_FILE = path.join(process.cwd(), 'pages/api/advice.txt');

async function updateAdvice() {
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
        }
    } catch (error) {
        console.error('Error updating advice:', error);
    }
}

// Schedule the update for 2 AM
function scheduleUpdate() {
    const now = new Date();
    const targetTime = new Date(now);
    targetTime.setHours(2, 0, 0, 0);
    
    if (now > targetTime) {
        targetTime.setDate(targetTime.getDate() + 1);
    }
    
    const timeUntilUpdate = targetTime - now;
    setTimeout(() => {
        updateAdvice();
        // Schedule next update for tomorrow
        scheduleUpdate();
    }, timeUntilUpdate);
}

// Start the scheduler
scheduleUpdate(); 
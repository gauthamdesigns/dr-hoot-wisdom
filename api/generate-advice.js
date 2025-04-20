import config from '../js/config.js';

export async function generateAdvice() {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.openaiApiKey}`
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
        
        if (!data.choices?.[0]?.message?.content) {
            throw new Error('No advice generated');
        }

        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error generating advice:', error);
        return getBackupAdvice();
    }
}

function getBackupAdvice() {
    const backupAdvices = [
        "Life is like a sandwich - the bread comes first",
        "Dance like nobody is watching your browser history",
        "If you can't convince them, confuse them",
        "Be yourself, everyone else is already taken",
        "Don't take life too seriously, you won't get out alive"
    ];
    return backupAdvices[Math.floor(Math.random() * backupAdvices.length)];
} 
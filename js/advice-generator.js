import config from './config.js';

class AdviceGenerator {
    constructor() {
        this.apiKey = config.OPENAI_API_KEY;
        this.lastUpdateTime = null;
        this.currentAdvice = null;
    }

    async generateAdvice() {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
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
                this.currentAdvice = data.choices[0].message.content.trim();
                this.lastUpdateTime = new Date();
                this.saveToLocalStorage();
                return this.currentAdvice;
            }
            throw new Error('No advice generated');
        } catch (error) {
            console.error('Error generating advice:', error);
            return this.getBackupAdvice();
        }
    }

    getBackupAdvice() {
        const backupAdvice = [
            "Your soulmate is probably in your spam folder",
            "If plan A fails, the alphabet has 25 more letters",
            "When life gives you lemons, ask for a gift receipt",
            "Dance like your internet connection just came back",
            "The early bird gets the worm, but the second mouse gets the cheese"
        ];
        return backupAdvice[Math.floor(Math.random() * backupAdvice.length)];
    }

    saveToLocalStorage() {
        localStorage.setItem('drHootAdvice', JSON.stringify({
            advice: this.currentAdvice,
            timestamp: this.lastUpdateTime
        }));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('drHootAdvice');
        if (saved) {
            const { advice, timestamp } = JSON.parse(saved);
            this.currentAdvice = advice;
            this.lastUpdateTime = new Date(timestamp);
        }
    }

    shouldUpdate() {
        if (!this.lastUpdateTime) return true;
        
        const now = new Date();
        const lastUpdate = new Date(this.lastUpdateTime);
        
        // Check if it's a new day and past 2 AM
        return now.getDate() !== lastUpdate.getDate() && now.getHours() >= 2;
    }
}

export default AdviceGenerator; 
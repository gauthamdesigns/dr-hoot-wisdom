class AdviceGenerator {
    constructor() {
        this.lastUpdateTime = null;
        this.currentAdvice = null;
    }

    async generateAdvice() {
        try {
            const response = await fetch('/api/generate-advice');
            const data = await response.json();
            
            if (data.advice) {
                this.currentAdvice = data.advice;
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
        // If we don't have any advice yet, we need to generate it
        if (!this.currentAdvice) return true;
        
        // If we don't have a last update time, we need to generate new advice
        if (!this.lastUpdateTime) return true;
        
        const now = new Date();
        const lastUpdate = new Date(this.lastUpdateTime);
        
        // Check if it's a new day and past 2 AM
        const isNewDay = now.getDate() !== lastUpdate.getDate();
        const isPast2AM = now.getHours() >= 2;
        
        return isNewDay && isPast2AM;
    }
}

export default AdviceGenerator; 
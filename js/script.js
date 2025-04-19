// Advice Generator Class
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
        if (!this.currentAdvice) return true;
        if (!this.lastUpdateTime) return true;
        
        const now = new Date();
        const lastUpdate = new Date(this.lastUpdateTime);
        
        return now.getDate() !== lastUpdate.getDate() || 
               now.getMonth() !== lastUpdate.getMonth() || 
               now.getFullYear() !== lastUpdate.getFullYear();
    }
}

// Initialize advice generator
const adviceGenerator = new AdviceGenerator();

// Time and theme management
function updateTimeAndTheme() {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const isNight = hour >= 18 || hour < 6;
    
    // Update theme
    document.body.classList.toggle('night-mode', isNight);
    document.body.classList.toggle('day-mode', !isNight);
    
    // Update time display with current time
    const timeDisplay = document.getElementById('currentTime');
    if (!timeDisplay) return;
    
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');
    timeDisplay.textContent = `${hour12}:${minutesStr}:${secondsStr} ${ampm}`;
}

// Update advice
async function updateAdvice() {
    const advice = await adviceGenerator.generateAdvice();
    const adviceText = document.getElementById('adviceText');
    adviceText.textContent = `"${advice}"`;
}

// Initialize advice
async function initialize() {
    // Load any saved advice first
    adviceGenerator.loadFromLocalStorage();
    
    // Only update if we need to (once per day)
    if (adviceGenerator.shouldUpdate()) {
        await updateAdvice();
    } else if (adviceGenerator.currentAdvice) {
        // If we have saved advice and don't need to update, use it
        document.getElementById('adviceText').textContent = `"${adviceGenerator.currentAdvice}"`;
    } else {
        // If we have no advice at all, generate some
        await updateAdvice();
    }
}

// Share functionality
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 1rem;
        z-index: 1000;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

async function shareContent() {
    const adviceText = document.getElementById('adviceText');
    const text = adviceText.textContent;
    const textWithCredit = `${text}\n@Dr. Hoot`;
    
    try {
        await navigator.clipboard.writeText(textWithCredit);
        showToast('Advice copied to clipboard! 📋');
        
        const shareButton = document.getElementById('shareButton');
        const originalText = shareButton.textContent;
        shareButton.textContent = 'Copied!';
        setTimeout(() => {
            shareButton.textContent = originalText;
        }, 2000);
    } catch (err) {
        showToast('Failed to copy text. Please try again.');
    }
}

// Initialize everything when the page loads
window.onload = function() {
    // Update time immediately and set interval
    updateTimeAndTheme();
    setInterval(updateTimeAndTheme, 1000);
    
    // Initialize the page
    initialize();
    
    // Set up share button
    const shareButton = document.getElementById('shareButton');
    shareButton.addEventListener('click', shareContent);
};

// Check and update advice
function checkAndUpdateAdvice() {
    if (adviceGenerator.shouldUpdate()) {
        updateAdvice();
    }
}

// TODO: Add OpenAI API integration for daily advice updates
// This will be implemented later when we have the API key 
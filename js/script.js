// Simple advice storage class
class AdviceStorage {
    constructor() {
        this.currentAdvice = null;
        this.lastUpdateTime = null;
    }

    async getStoredAdvice() {
        try {
            const response = await fetch('/api/stored-advice');
            if (!response.ok) {
                throw new Error('Failed to fetch stored advice');
            }
            const data = await response.json();
            
            // Check if the stored advice is from today
            const today = new Date().toISOString().split('T')[0];
            if (data.advice && data.timestamp && data.timestamp.startsWith(today)) {
                this.currentAdvice = data.advice;
                this.lastUpdateTime = data.timestamp;
                return { advice: this.currentAdvice, lastUpdated: this.lastUpdateTime };
            }
            
            // If stored advice is not from today, force an update
            const updateResponse = await fetch('/api/update-advice');
            if (!updateResponse.ok) {
                throw new Error('Failed to update advice');
            }
            const updateData = await updateResponse.json();
            
            this.currentAdvice = updateData.advice;
            this.lastUpdateTime = updateData.timestamp;
            return { advice: this.currentAdvice, lastUpdated: this.lastUpdateTime };
        } catch (error) {
            console.error('Error getting stored advice:', error);
            return { advice: this.getBackupAdvice(), lastUpdated: null };
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
}

// Initialize advice storage
const adviceStorage = new AdviceStorage();

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
    
    // Update time display
    const timeDisplay = document.getElementById('currentTime');
    if (timeDisplay) {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');
        timeDisplay.textContent = `${hour12}:${minutesStr}:${secondsStr} ${ampm}`;
    }
}

// Update advice display
async function updateAdviceDisplay() {
    try {
        const { advice, lastUpdated } = await adviceStorage.getStoredAdvice();
        const adviceText = document.getElementById('adviceText');
        const updateTime = document.getElementById('updateTime');
        
        if (adviceText) {
            adviceText.textContent = advice;
        }
        
        if (updateTime && lastUpdated) {
            const date = new Date(lastUpdated);
            updateTime.textContent = `Last updated: ${date.toLocaleString()}`;
        }
    } catch (error) {
        console.error('Error updating advice display:', error);
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
    
    // Display current advice
    updateAdviceDisplay();
    
    // Set up share button
    const shareButton = document.getElementById('shareButton');
    shareButton.addEventListener('click', shareContent);
};

// Check and update advice
function checkAndUpdateAdvice() {
    if (adviceStorage.isNewDay()) {
        updateAdvice();
    }
}

// TODO: Add OpenAI API integration for daily advice updates
// This will be implemented later when we have the API key

// Use a single storage location and format
const STORAGE_PATH = path.join(process.cwd(), 'data', 'advice.json'); 
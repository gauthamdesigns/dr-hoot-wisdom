// Simple advice storage class
class AdviceStorage {
    constructor() {
        this.loadFromStorage();
    }

    loadFromStorage() {
        const stored = localStorage.getItem('drHootAdvice');
        if (stored) {
            const { advice, date } = JSON.parse(stored);
            this.currentAdvice = advice;
            this.lastUpdateDate = new Date(date);
        } else {
            this.currentAdvice = null;
            this.lastUpdateDate = null;
        }
    }

    saveToStorage(advice) {
        const now = new Date();
        const data = {
            advice: advice,
            date: now.toISOString()
        };
        localStorage.setItem('drHootAdvice', JSON.stringify(data));
        this.currentAdvice = advice;
        this.lastUpdateDate = now;
    }

    isNewDay() {
        if (!this.lastUpdateDate) return true;
        
        const now = new Date();
        const lastUpdate = new Date(this.lastUpdateDate);
        
        return now.getDate() !== lastUpdate.getDate() ||
               now.getMonth() !== lastUpdate.getMonth() ||
               now.getFullYear() !== lastUpdate.getFullYear();
    }

    getCurrentAdvice() {
        return this.currentAdvice;
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

// Get advice from API
async function getNewAdvice() {
    try {
        const response = await fetch('/api/generate-advice');
        const data = await response.json();
        return data.advice;
    } catch (error) {
        console.error('Error getting advice:', error);
        return getBackupAdvice();
    }
}

// Backup advice if API fails
function getBackupAdvice() {
    const backupAdvice = [
        "Your soulmate is probably in your spam folder",
        "If plan A fails, the alphabet has 25 more letters",
        "When life gives you lemons, ask for a gift receipt",
        "Dance like your internet connection just came back",
        "The early bird gets the worm, but the second mouse gets the cheese"
    ];
    return backupAdvice[Math.floor(Math.random() * backupAdvice.length)];
}

// Update advice display
function updateAdviceDisplay(advice) {
    const adviceText = document.getElementById('adviceText');
    if (adviceText) {
        adviceText.textContent = `"${advice}"`;
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
window.onload = async function() {
    // Update time immediately and set interval
    updateTimeAndTheme();
    setInterval(updateTimeAndTheme, 1000);
    
    // Check if we need new advice
    if (adviceStorage.isNewDay()) {
        const newAdvice = await getNewAdvice();
        adviceStorage.saveToStorage(newAdvice);
    }
    
    // Display current advice
    updateAdviceDisplay(adviceStorage.getCurrentAdvice());
    
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
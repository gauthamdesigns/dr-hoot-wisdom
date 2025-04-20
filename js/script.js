// Simple advice storage class
class AdviceStorage {
    constructor() {
        this.currentAdvice = null;
    }

    async getAdvice() {
        try {
            const response = await fetch('/api/daily-advice');
            const data = await response.json();
            if (data.advice) {
                this.currentAdvice = data.advice;
                return this.currentAdvice;
            }
            throw new Error('No advice received');
        } catch (error) {
            console.error('Error getting advice:', error);
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
}

// Initialize advice storage
const adviceStorage = new AdviceStorage();

// Time and theme management
function updateTimeAndTheme() {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // Day: 6 AM - 6 PM, Night: 6 PM - 6 AM
    const isNight = hour >= 18 || hour < 6;
    const isTransition = (hour >= 17 && hour < 18) || (hour >= 5 && hour < 6);
    
    // Update theme and transitions
    document.body.classList.toggle('night-mode', isNight);
    document.body.classList.toggle('day-mode', !isNight);
    document.body.classList.toggle('theme-transition', isTransition);
    
    // Update owl image
    const owlImage = document.getElementById('owlImage');
    if (owlImage) {
        owlImage.src = isNight ? 'images/Dr.Hoot Awake.png' : 'images/Dr.hoot asleep.png';
    }
    
    // Update time display
    const timeDisplay = document.getElementById('currentTime');
    if (timeDisplay) {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        timeDisplay.textContent = `${hour12}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
    }
}

// Update advice display
async function updateAdviceDisplay() {
    try {
        const response = await fetch('/api/daily-advice');
        const data = await response.json();
        const adviceText = document.getElementById('adviceText');
        if (adviceText && data.advice) {
            adviceText.textContent = data.advice;
        }
    } catch (error) {
        console.error('Error fetching advice:', error);
    }
}

// Share functionality
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = 'toast-message';
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

async function shareContent() {
    const adviceText = document.getElementById('adviceText');
    const text = `${adviceText.textContent}\n@Dr. Hoot`;
    
    try {
        await navigator.clipboard.writeText(text);
        showToast('Advice copied to clipboard! 📋');
        
        const shareButton = document.getElementById('shareButton');
        shareButton.textContent = 'Copied!';
        setTimeout(() => shareButton.textContent = 'Share', 2000);
    } catch (err) {
        showToast('Failed to copy text. Please try again.');
    }
}

// Initialize
window.onload = function() {
    updateTimeAndTheme();
    setInterval(updateTimeAndTheme, 1000);
    updateAdviceDisplay();
    
    const shareButton = document.getElementById('shareButton');
    if (shareButton) {
        shareButton.addEventListener('click', shareContent);
    }
};

// Check and update advice
function checkAndUpdateAdvice() {
    if (adviceStorage.isNewDay()) {
        updateAdvice();
    }
}

// TODO: Add OpenAI API integration for daily advice updates
// This will be implemented later when we have the API key 
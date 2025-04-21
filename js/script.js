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
        const response = await fetch('/api/get-advice');
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

// Check for new day and update advice
function checkForNewDay() {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const lastFetchDate = localStorage.getItem('lastAdviceDate');
    
    if (lastFetchDate !== currentDate) {
        updateAdviceDisplay();
        localStorage.setItem('lastAdviceDate', currentDate);
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
    
    // Check for new day every minute
    setInterval(checkForNewDay, 60000);
}; 
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
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    const minutesStr = minutes.toString().padStart(2, '0');
    timeDisplay.textContent = `${hour12}:${minutesStr} ${ampm}`;
}

// Update time and theme immediately and then every second
updateTimeAndTheme();
setInterval(updateTimeAndTheme, 1000);

// Share functionality
const shareButton = document.getElementById('shareButton');
const adviceText = document.getElementById('adviceText');

async function showToast(message) {
    // Create and style toast notification
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
    
    // Remove toast after 2 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

async function shareContent() {
    const text = adviceText.textContent;
    const textWithCredit = `${text}\n@Dr. Hoot`;
    
    try {
        await navigator.clipboard.writeText(textWithCredit);
        showToast('Advice copied to clipboard! 📋');
        
        // Change button text temporarily
        const originalText = shareButton.textContent;
        shareButton.textContent = 'Copied!';
        setTimeout(() => {
            shareButton.textContent = originalText;
        }, 2000);
        
    } catch (err) {
        showToast('Failed to copy text. Please try again.');
        console.error('Error copying text:', err);
    }
}

shareButton.addEventListener('click', shareContent);

// TODO: Add OpenAI API integration for daily advice updates
// This will be implemented later when we have the API key 
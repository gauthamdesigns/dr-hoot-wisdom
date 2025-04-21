let currentAdvice = null;
let lastFetchTime = null;
const adviceElement = document.getElementById('adviceText');
const shareButton = document.getElementById('shareButton');

async function fetchAdvice() {
    try {
        const response = await fetch('/api/advice');
        if (!response.ok) {
            throw new Error('Failed to fetch advice');
        }
        const data = await response.json();
        console.log('Received advice:', data);
        
        // Always update the advice and timestamp
        currentAdvice = data.advice;
        adviceElement.textContent = currentAdvice;
        lastFetchTime = new Date(data.timestamp);
        updateShareButton();
    } catch (error) {
        console.error('Error fetching advice:', error);
        adviceElement.textContent = "If at first you don't succeed, blame it on the WiFi";
    }
}

function checkForNewDay() {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const lastFetchDate = lastFetchTime ? lastFetchTime.toISOString().split('T')[0] : null;
    
    console.log('Current date:', currentDate);
    console.log('Last fetch date:', lastFetchDate);
    
    // Only fetch new advice if we're on a different day
    if (lastFetchDate !== currentDate) {
        console.log('Fetching new advice for new day');
        fetchAdvice();
    }
}

function updateShareButton() {
    if (currentAdvice) {
        shareButton.onclick = () => {
            const shareText = `${currentAdvice} - Dr. Hoot's Daily Wisdom`;
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Advice copied to clipboard!');
            });
        };
    }
}

// Initial fetch
fetchAdvice();

// Check for new day every minute
setInterval(checkForNewDay, 60000); 
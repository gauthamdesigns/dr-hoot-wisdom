let currentAdvice = null;
let lastFetchTime = null;
const adviceElement = document.getElementById('adviceText');
const shareButton = document.getElementById('shareButton');
const timeElement = document.getElementById('currentTime');
const body = document.body;

// Update time and theme
function updateTimeAndTheme() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    timeElement.textContent = `${displayHours}:${minutes}:${seconds} ${ampm}`;
    
    // Update theme based on time
    if (hours >= 6 && hours < 18) {
        body.classList.remove('night-mode');
        body.classList.add('day-mode');
    } else {
        body.classList.remove('day-mode');
        body.classList.add('night-mode');
    }
}

async function fetchAdvice() {
    try {
        // Add cache-busting parameter
        const response = await fetch(`/api/advice?t=${Date.now()}`);
        if (!response.ok) {
            throw new Error('Failed to fetch advice');
        }
        const data = await response.json();
        console.log('Received advice data:', {
            advice: data.advice,
            timestamp: data.timestamp,
            currentTime: new Date().toISOString()
        });
        
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
    
    console.log('Date check:', {
        currentDate,
        lastFetchDate,
        currentTime: now.toISOString(),
        lastFetchTime: lastFetchTime ? lastFetchTime.toISOString() : null
    });
    
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

// Initial setup
updateTimeAndTheme();
fetchAdvice();

// Update time and theme every second
setInterval(updateTimeAndTheme, 1000);

// Check for new day every minute
setInterval(checkForNewDay, 60000); 
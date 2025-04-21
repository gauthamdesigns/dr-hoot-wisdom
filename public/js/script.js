async function fetchAdvice() {
    try {
        const response = await fetch('/api/advice');
        if (!response.ok) {
            throw new Error('Failed to fetch advice');
        }
        const data = await response.json();
        
        // Only update the advice if it's not cached or if we don't have any advice yet
        if (!data.isCached || !currentAdvice) {
            currentAdvice = data.advice;
            adviceElement.textContent = currentAdvice;
            updateShareButton();
        }
        
        // Update the timestamp regardless
        lastFetchTime = new Date(data.timestamp);
    } catch (error) {
        console.error('Error fetching advice:', error);
        adviceElement.textContent = "If at first you don't succeed, blame it on the WiFi";
    }
}

// Update the checkForNewDay function to be more precise
function checkForNewDay() {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const lastFetchDate = lastFetchTime ? lastFetchTime.toISOString().split('T')[0] : null;
    
    // Only fetch new advice if we're on a different day
    if (lastFetchDate !== currentDate) {
        fetchAdvice();
    }
} 
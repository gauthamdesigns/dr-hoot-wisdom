import fs from 'fs';
import path from 'path';

const STORAGE_PATH = path.join(process.cwd(), 'data', 'advice.json');

// Define preset advice options
const PRESET_ADVICE = [
    "Always carry a spare pair of socks. You never know when you'll need to make a quick escape.",
    "If life gives you lemons, make sure they're not actually limes in disguise.",
    "Never trust a penguin with your lunch. They have a history of fish-related crimes.",
    "When in doubt, do a little dance. It confuses your enemies and amuses your friends.",
    "Remember: the early bird gets the worm, but the second mouse gets the cheese."
];

// Global cache object
const cache = {
    advice: null,
    timestamp: null,
    date: null
};

// Get current date in YYYY-MM-DD format
function getCurrentDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

export function readStorage() {
    try {
        const currentDate = getCurrentDate();
        
        // If cache is empty or date is different, generate new advice
        if (!cache.advice || !cache.date || cache.date !== currentDate) {
            const randomIndex = Math.floor(Math.random() * PRESET_ADVICE.length);
            cache.advice = PRESET_ADVICE[randomIndex];
            cache.timestamp = new Date().toISOString();
            cache.date = currentDate;
        }
        
        return {
            advice: cache.advice,
            timestamp: cache.timestamp
        };
    } catch (error) {
        console.error('Error reading storage:', error);
        // Return default advice if there's an error
        return {
            advice: PRESET_ADVICE[0],
            timestamp: new Date().toISOString()
        };
    }
}

export function writeStorage(data) {
    try {
        cache.advice = data.advice;
        cache.timestamp = data.timestamp;
        cache.date = getCurrentDate();
        return true;
    } catch (error) {
        console.error('Error writing storage:', error);
        return false;
    }
}

function isFromToday(timestamp) {
    if (!timestamp) return false;
    const storedDate = new Date(timestamp);
    const today = new Date();
    return storedDate.getDate() === today.getDate() &&
           storedDate.getMonth() === today.getMonth() &&
           storedDate.getFullYear() === today.getFullYear();
} 
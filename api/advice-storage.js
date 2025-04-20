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

let currentAdvice = null;
let lastUpdateTime = null;

export function readStorage() {
    // If we have advice and it's from today, return it
    if (currentAdvice && isFromToday(lastUpdateTime)) {
        return { advice: currentAdvice, timestamp: lastUpdateTime };
    }
    
    // If no advice or it's from a different day, get a random preset
    const randomIndex = Math.floor(Math.random() * PRESET_ADVICE.length);
    currentAdvice = PRESET_ADVICE[randomIndex];
    lastUpdateTime = new Date().toISOString();
    
    return { advice: currentAdvice, timestamp: lastUpdateTime };
}

export function writeStorage(data) {
    currentAdvice = data.advice;
    lastUpdateTime = data.timestamp;
    return true;
}

function isFromToday(timestamp) {
    if (!timestamp) return false;
    const storedDate = new Date(timestamp);
    const today = new Date();
    return storedDate.getDate() === today.getDate() &&
           storedDate.getMonth() === today.getMonth() &&
           storedDate.getFullYear() === today.getFullYear();
} 
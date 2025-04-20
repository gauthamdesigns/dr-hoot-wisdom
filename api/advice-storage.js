import fs from 'fs';
import path from 'path';

const STORAGE_PATH = path.join(process.cwd(), 'data', 'advice.json');

// Define the single piece of advice
const STORED_ADVICE = "Always carry a spare pair of socks. You never know when you'll need to make a quick escape.";

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
    return {
        advice: STORED_ADVICE,
        timestamp: new Date().toISOString()
    };
}

export function writeStorage(data) {
    // This function is kept for compatibility but doesn't do anything
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
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

export function readStorage() {
    try {
        // Create data directory if it doesn't exist
        const dir = path.dirname(STORAGE_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // If file doesn't exist, create it with initial data
        if (!fs.existsSync(STORAGE_PATH)) {
            const initialData = {
                advice: PRESET_ADVICE[0],
                timestamp: new Date().toISOString()
            };
            fs.writeFileSync(STORAGE_PATH, JSON.stringify(initialData, null, 2));
            return initialData;
        }

        // Read and parse existing data
        const data = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf8'));
        
        // If data is from a different day, update it
        if (!isFromToday(data.timestamp)) {
            const randomIndex = Math.floor(Math.random() * PRESET_ADVICE.length);
            const newData = {
                advice: PRESET_ADVICE[randomIndex],
                timestamp: new Date().toISOString()
            };
            fs.writeFileSync(STORAGE_PATH, JSON.stringify(newData, null, 2));
            return newData;
        }

        return data;
    } catch (error) {
        console.error('Error reading storage:', error);
        // Return a default advice if there's an error
        return {
            advice: PRESET_ADVICE[0],
            timestamp: new Date().toISOString()
        };
    }
}

export function writeStorage(data) {
    try {
        const dir = path.dirname(STORAGE_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(STORAGE_PATH, JSON.stringify(data, null, 2));
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
import fs from 'fs';
import path from 'path';

const STORAGE_FILE = path.join(process.cwd(), 'advice-storage.json');

function readStorage() {
    try {
        if (fs.existsSync(STORAGE_FILE)) {
            const data = fs.readFileSync(STORAGE_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading storage:', error);
    }
    return { advice: null, date: null };
}

function writeStorage(advice, date) {
    try {
        const data = JSON.stringify({ advice, date });
        fs.writeFileSync(STORAGE_FILE, data);
    } catch (error) {
        console.error('Error writing storage:', error);
    }
}

export { readStorage, writeStorage }; 
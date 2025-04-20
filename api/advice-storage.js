import fs from 'fs';
import path from 'path';

const STORAGE_PATH = path.join(process.cwd(), 'data', 'advice.json');

export function readStorage() {
    try {
        if (!fs.existsSync(STORAGE_PATH)) {
            return { advice: null, timestamp: null };
        }
        const data = fs.readFileSync(STORAGE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading storage:', error);
        return { advice: null, timestamp: null };
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
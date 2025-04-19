import fs from 'fs';
import path from 'path';

const ADVICE_FILE = path.join(process.cwd(), 'api/advice.txt');

export default function handler(request, response) {
    if (request.method !== 'GET') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const advice = fs.readFileSync(ADVICE_FILE, 'utf8');
        return response.status(200).json({ advice });
    } catch (error) {
        console.error('Error reading advice:', error);
        return response.status(500).json({ error: 'Failed to read advice' });
    }
} 
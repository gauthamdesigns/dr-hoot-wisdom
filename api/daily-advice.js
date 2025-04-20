import { generateAdvice } from './generate-advice.js';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ADVICE_FILE = join(process.cwd(), 'api', 'advice.txt');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Read current advice
        let advice = readFileSync(ADVICE_FILE, 'utf8').trim();
        
        // Generate new advice if needed
        const now = new Date();
        const updateHour = 2; // 2 AM
        
        if (now.getHours() === updateHour && advice.length === 0) {
            advice = await generateAdvice();
            writeFileSync(ADVICE_FILE, advice);
        }
        
        return res.status(200).json({ advice });
    } catch (error) {
        console.error('Error in daily-advice:', error);
        return res.status(500).json({ error: 'Failed to get advice' });
    }
} 
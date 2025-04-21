import { readStorage, writeStorage } from './advice-storage.js';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const CSV_PATH = path.join(process.cwd(), 'data', 'advice.csv');

function getAdviceFromCSV() {
    try {
        const csvContent = fs.readFileSync(CSV_PATH, 'utf8');
        const records = parse(csvContent, {
            columns: true,
            skip_empty_lines: true
        });
        
        const today = new Date().toISOString().split('T')[0];
        const adviceForToday = records.find(record => record.date === today);
        
        if (adviceForToday) {
            return adviceForToday.advice;
        }
        
        // If no advice for today, return the first advice in the list
        return records[0].advice;
    } catch (error) {
        console.error('Error reading CSV:', error);
        return "If at first you don't succeed, blame it on the WiFi"; // Fallback advice
    }
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Check if we already have today's advice
        const stored = readStorage();
        const today = new Date().toISOString().split('T')[0];
        
        if (stored.advice && stored.timestamp && stored.timestamp.startsWith(today)) {
            return res.status(200).json({
                success: true,
                advice: stored.advice,
                timestamp: stored.timestamp
            });
        }

        // Get advice from CSV
        const advice = getAdviceFromCSV();
        const timestamp = new Date().toISOString();

        // Store the new advice
        const success = writeStorage({
            advice,
            timestamp
        });

        if (!success) {
            throw new Error('Failed to store advice');
        }

        return res.status(200).json({
            success: true,
            advice,
            timestamp
        });
    } catch (error) {
        console.error('Error updating advice:', error);
        return res.status(500).json({
            error: 'Failed to update advice',
            message: error.message
        });
    }
} 
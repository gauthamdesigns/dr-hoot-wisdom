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
        
        // If no advice for today, find the closest future date
        const futureAdvice = records
            .filter(record => record.date > today)
            .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
        
        if (futureAdvice) {
            return futureAdvice.advice;
        }
        
        // If no future advice, return the last advice in the list
        return records[records.length - 1].advice;
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
        const advice = getAdviceFromCSV();
        const timestamp = new Date().toISOString();

        return res.status(200).json({ 
            advice, 
            timestamp,
            isCached: false
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ 
            error: 'Failed to fetch advice',
            message: error.message
        });
    }
} 
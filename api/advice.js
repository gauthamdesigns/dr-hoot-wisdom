import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const CSV_PATH = path.join(process.cwd(), 'data', 'advice.csv');

function getAdviceFromCSV() {
    try {
        // Read and parse CSV
        const csvContent = fs.readFileSync(CSV_PATH, 'utf8');
        console.log('CSV Content:', csvContent.substring(0, 200) + '...'); // Log first 200 chars
        
        const records = parse(csvContent, {
            columns: true,
            skip_empty_lines: true
        });
        console.log('Total records:', records.length);
        
        // Get today's date in YYYY-MM-DD format
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        console.log('Current date:', today);
        console.log('Current time:', now.toISOString());
        
        // Log first few records to verify format
        console.log('First few records:', records.slice(0, 3));
        
        // Find exact match for today
        const adviceForToday = records.find(record => {
            console.log('Comparing:', record.date, 'with', today);
            return record.date === today;
        });
        
        if (adviceForToday) {
            console.log('Found exact match for today:', adviceForToday);
            return adviceForToday.advice;
        }
        
        // If no advice for today, find the closest future date
        const futureAdvice = records
            .filter(record => {
                const recordDate = new Date(record.date);
                const todayDate = new Date(today);
                return recordDate > todayDate;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
        
        if (futureAdvice) {
            console.log('Found future advice:', futureAdvice);
            return futureAdvice.advice;
        }
        
        // If no future advice, return the last advice in the list
        const lastAdvice = records[records.length - 1];
        console.log('Using last advice:', lastAdvice);
        return lastAdvice.advice;
    } catch (error) {
        console.error('Error reading CSV:', error);
        return "If at first you don't succeed, blame it on the WiFi";
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
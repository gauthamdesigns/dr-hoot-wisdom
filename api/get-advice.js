import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const ADVICE_CSV = path.join(process.cwd(), 'advice.csv');

function getAdviceFromCSV() {
    try {
        const csvContent = fs.readFileSync(ADVICE_CSV, 'utf8');
        const records = parse(csvContent, {
            columns: true,
            skip_empty_lines: true
        });

        const today = new Date().toISOString().split('T')[0];
        
        // Find advice for today
        const todayAdvice = records.find(record => record.date === today);
        
        if (todayAdvice) {
            return todayAdvice.advice;
        }

        // If no advice for today, find the closest future advice
        const futureAdvice = records.find(record => record.date > today);
        if (futureAdvice) {
            return futureAdvice.advice;
        }

        // If no future advice, return the last advice in the list
        return records[records.length - 1].advice;
    } catch (error) {
        console.error('Error reading advice CSV:', error);
        return null;
    }
}

export default function handler(request, response) {
    if (request.method !== 'GET') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const advice = getAdviceFromCSV();
        if (!advice) {
            return response.status(500).json({ error: 'Failed to get advice' });
        }
        return response.status(200).json({ advice });
    } catch (error) {
        console.error('Error handling advice request:', error);
        return response.status(500).json({ error: 'Failed to handle advice request' });
    }
} 
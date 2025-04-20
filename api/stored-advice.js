import { readStorage } from './advice-storage.js';

export default async function handler(request, response) {
    if (request.method !== 'GET') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { advice, timestamp } = readStorage();
        
        if (!advice) {
            return response.status(404).json({ error: 'No advice available' });
        }

        return response.status(200).json({
            advice,
            timestamp,
            lastUpdated: timestamp ? new Date(timestamp).toLocaleString() : null
        });
    } catch (error) {
        console.error('Error retrieving stored advice:', error);
        return response.status(500).json({ error: 'Failed to retrieve advice' });
    }
} 
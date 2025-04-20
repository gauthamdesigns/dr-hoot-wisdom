import { readStorage } from './advice-storage.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Simply return the stored advice
    const stored = readStorage();
    return res.status(200).json(stored);
} 
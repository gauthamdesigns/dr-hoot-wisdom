import { readStorage, writeStorage } from './advice-storage.js';

// Define preset advice options
const PRESET_ADVICE = [
    "Always carry a spare pair of socks. You never know when you'll need to make a quick escape.",
    "If life gives you lemons, make sure they're not actually limes in disguise.",
    "Never trust a penguin with your lunch. They have a history of fish-related crimes.",
    "When in doubt, do a little dance. It confuses your enemies and amuses your friends.",
    "Remember: the early bird gets the worm, but the second mouse gets the cheese."
];

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get a random preset advice
        const randomIndex = Math.floor(Math.random() * PRESET_ADVICE.length);
        const advice = PRESET_ADVICE[randomIndex];
        const timestamp = new Date().toISOString();

        // Store the new advice
        writeStorage({ advice, timestamp });

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
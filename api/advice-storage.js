import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const STORAGE_PATH = path.join(process.cwd(), 'data', 'advice.json');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Cache for the current day's advice
let currentAdvice = null;
let lastUpdateDate = null;

// Define the single piece of advice
const STORED_ADVICE = "Always carry a spare pair of socks. You never know when you'll need to make a quick escape.";

// Global cache object
const cache = {
    advice: null,
    timestamp: null,
    date: null
};

// Get current date in YYYY-MM-DD format
function getCurrentDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

async function generateAdvice() {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content: "You are Dr. Hoot, a wise but quirky owl who gives nonsensical yet amusing life advice. Your advice should be funny, slightly absurd, but with a tiny grain of wisdom. Keep responses under 100 characters."
            }, {
                role: "user",
                content: "Give me one piece of life advice."
            }],
            max_tokens: 50,
            temperature: 0.8
        });

        if (completion.choices && completion.choices[0]) {
            return completion.choices[0].message.content.trim();
        }
        throw new Error('No advice generated');
    } catch (error) {
        console.error('Error generating advice:', error);
        throw error;
    }
}

function isNewDay() {
    if (!lastUpdateDate) return true;
    const today = new Date().toISOString().split('T')[0];
    return lastUpdateDate !== today;
}

export async function readStorage() {
    try {
        // If it's a new day or we don't have advice, generate new advice
        if (isNewDay() || !currentAdvice) {
            currentAdvice = await generateAdvice();
            lastUpdateDate = new Date().toISOString().split('T')[0];
        }

        return {
            advice: currentAdvice,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error in readStorage:', error);
        // Return a default advice if there's an error
        return {
            advice: "Always carry a spare pair of socks. You never know when you'll need to make a quick escape.",
            timestamp: new Date().toISOString()
        };
    }
}

export function writeStorage(data) {
    // This function is kept for compatibility but doesn't do anything
    return true;
}

function isFromToday(timestamp) {
    if (!timestamp) return false;
    const storedDate = new Date(timestamp);
    const today = new Date();
    return storedDate.getDate() === today.getDate() &&
           storedDate.getMonth() === today.getMonth() &&
           storedDate.getFullYear() === today.getFullYear();
} 
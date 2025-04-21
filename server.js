import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Serve static files
app.use(express.static('.'));

// API endpoint
app.get('/api/get-advice', async (req, res) => {
    const ADVICE_FILE = path.join(__dirname, 'pages/api/advice.txt');

    try {
        // Read and return current advice
        const advice = fs.readFileSync(ADVICE_FILE, 'utf8');
        res.json({ advice });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to handle advice request' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 
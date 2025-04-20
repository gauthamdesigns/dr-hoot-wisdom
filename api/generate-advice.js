export default async function handler(request, response) {
    if (request.method !== 'GET') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
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
            })
        });

        const data = await openaiResponse.json();
        
        if (data.choices && data.choices[0]) {
            return response.status(200).json({
                advice: data.choices[0].message.content.trim()
            });
        }
        
        throw new Error('No advice generated');
    } catch (error) {
        console.error('Error generating advice:', error);
        return response.status(500).json({
            error: 'Failed to generate advice',
            message: error.message
        });
    }
} 
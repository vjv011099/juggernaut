import axios from 'axios';

export class PerplexityClient {
    private apiKey: string;
    private apiUrl = 'https://api.perplexity.ai/chat/completions';

    constructor() {
        const key = process.env.PERPLEXITY_API_KEY;
        if (!key) {
            throw new Error('PERPLEXITY_API_KEY is not defined in environment variables');
        }
        this.apiKey = key;
    }

    async researchMarketTrends(category: string, country: string) {
        try {
            const response = await axios.post(
                this.apiUrl,
                {
                    model: 'sonar-pro',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a real-time market research assistant.'
                        },
                        {
                            role: 'user',
                            content: `What are the current market trends and seasonal price fluctuations for "${category}" in ${country}? Provide recent data points.`
                        }
                    ]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.choices[0].message.content;
        } catch (error: any) {
            console.error('Perplexity Research Error:', error.response?.data || error.message);
            throw error;
        }
    }
}

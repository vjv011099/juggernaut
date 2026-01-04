import axios from 'axios';

export class AnthropicClient {
    private apiKey: string;
    private apiUrl = 'https://api.anthropic.com/v1/messages';

    constructor() {
        const key = process.env.ANTHROPIC_API_KEY;
        if (!key) {
            throw new Error('ANTHROPIC_API_KEY is not defined in environment variables');
        }
        this.apiKey = key;
    }

    async analyzeCompetition(category: string, competitorData: any, country: string) {
        try {
            const response = await axios.post(
                this.apiUrl,
                {
                    model: 'claude-3-5-sonnet-20241022',
                    max_tokens: 1024,
                    messages: [
                        {
                            role: 'user',
                            content: `Provide a detailed competitive analysis for the category "${category}" in ${country} based on this data: \n${JSON.stringify(competitorData)}. Focus on price elasticities and brand positioning.`
                        }
                    ]
                },
                {
                    headers: {
                        'x-api-key': this.apiKey,
                        'anthropic-version': '2023-06-01',
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.content[0].text;
        } catch (error: any) {
            console.error('Anthropic Analysis Error:', error.response?.data || error.message);
            throw error;
        }
    }
}

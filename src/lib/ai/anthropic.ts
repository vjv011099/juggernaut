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
                    model: 'claude-3-haiku-20240307',
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
                        'x-api-key': this.apiKey.trim(),
                        'anthropic-version': '2023-06-01',
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.content[0].text;
        } catch (error: any) {
            const errorDetails = error.response?.data || error.message;
            console.error('Anthropic Analysis FULL Error:', JSON.stringify(errorDetails, null, 2));
            throw new Error(`Anthropic Error: ${JSON.stringify(errorDetails)}`);
        }
    }
}

import axios from 'axios';

export class OpenAIClient {
    private apiKey: string;
    private apiUrl = 'https://api.openai.com/v1/chat/completions';

    constructor() {
        const key = process.env.OPENAI_API_KEY;
        if (!key) {
            throw new Error('OPENAI_API_KEY is not defined in environment variables');
        }
        this.apiKey = key;
    }

    async analyzePricing(category: string, competitorData: any, country: string) {
        try {
            const response = await axios.post(
                this.apiUrl,
                {
                    model: 'gpt-4o',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert e-commerce pricing strategist for the European market. Always respond with a valid JSON object.'
                        },
                        {
                            role: 'user',
                            content: `Analyze the following data for the category "${category}" in ${country} and suggest an optimal pricing strategy. 
                            Data: ${JSON.stringify(competitorData)}
                            
                            Return a JSON object with the following structure:
                            {
                              "suggested_price": 0.00,
                              "rationale": "your detailed reasoning here"
                            }`
                        }
                    ],
                    response_format: { type: 'json_object' }
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
            console.error('OpenAI Analysis Error:', error.response?.data || error.message);
            throw error;
        }
    }
}

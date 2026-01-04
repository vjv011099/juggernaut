import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiClient {
    private genAI: GoogleGenerativeAI;

    constructor() {
        const key = process.env.GEMINI_API_KEY;
        if (!key) {
            throw new Error('GEMINI_API_KEY is not defined in environment variables');
        }
        this.genAI = new GoogleGenerativeAI(key);
    }

    async analyzeVisualsOrData(data: any) {
        try {
            const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const prompt = `Perform a multi-modal analysis of this product data for pricing optimization: \n${JSON.stringify(data)}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error('Gemini Analysis Error:', error.message);
            throw error;
        }
    }
}

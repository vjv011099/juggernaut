require('dotenv').config();
const { OpenAIClient } = require('./src/lib/ai/openai');
const { AnthropicClient } = require('./src/lib/ai/anthropic');
const { PerplexityClient } = require('./src/lib/ai/perplexity');
const { GeminiClient } = require('./src/lib/ai/gemini');

async function testAI() {
    console.log('--- Testing AI Modules ---');

    try {
        const openai = new OpenAIClient();
        console.log('OpenAI initialized');
        // await openai.analyzePricing('test', [], 'DE'); // Commented out to save tokens
    } catch (e) {
        console.error('OpenAI Error:', e.message);
    }

    try {
        const anthropic = new AnthropicClient();
        console.log('Anthropic initialized');
    } catch (e) {
        console.error('Anthropic Error:', e.message);
    }

    try {
        const perplexity = new PerplexityClient();
        console.log('Perplexity initialized');
    } catch (e) {
        console.error('Perplexity Error:', e.message);
    }

    try {
        const gemini = new GeminiClient();
        console.log('Gemini initialized');
    } catch (e) {
        console.error('Gemini Error:', e.message);
    }
}

testAI();

import { OpenAIClient } from '../../lib/ai/openai';
import { AnthropicClient } from '../../lib/ai/anthropic';
import { PerplexityClient } from '../../lib/ai/perplexity';
import { GeminiClient } from '../../lib/ai/gemini';
import { HeliumScraper } from '../../lib/helium/scraper';
import { WebAnalyzer } from '../../lib/utils/web-analyzer';

export class PricingModelService {
    private openai: OpenAIClient;
    private anthropic: AnthropicClient;
    private perplexity: PerplexityClient;
    private gemini: GeminiClient;
    private scraper: HeliumScraper;
    private analyzer: WebAnalyzer;

    constructor() {
        this.openai = new OpenAIClient();
        this.anthropic = new AnthropicClient();
        this.perplexity = new PerplexityClient();
        this.gemini = new GeminiClient();
        this.scraper = new HeliumScraper();
        this.analyzer = new WebAnalyzer();
    }

    async generatePricingRecommendation(category: string, countries: string[], clientUrl?: string) {
        let clientInfo = null;
        if (clientUrl) {
            try {
                console.log(`Analyzing client website: ${clientUrl}...`);
                clientInfo = await this.analyzer.fetchMetadata(clientUrl);
            } catch (e) {
                console.error('Web Analysis Error:', e);
            }
        }

        const clientProducts = clientInfo?.products || [{ title: category, price: 'N/A' }];
        const productResults: any[] = [];

        for (const product of clientProducts) {
            console.log(`Analyzing product: ${product.title}...`);
            const countryRecs: any = {};

            for (const country of countries) {
                try {
                    // 1. Scrape competitor data for this product category
                    let competitorData = [];
                    try {
                        competitorData = await this.scraper.scrapeData(product.title, country);
                    } catch (e) {
                        competitorData = [
                            { asin: 'B0-MOCK-1', title: `${product.title} Compeititor`, price: 29.99, rating: 4.6, sales: 1200 },
                            { asin: 'B0-MOCK-2', title: `${product.title} Budget`, price: 14.50, rating: 4.1, sales: 800 }
                        ];
                    }

                    // 2. Prepare context
                    const dataContext = {
                        category,
                        country,
                        product,
                        competitorData,
                        clientBrand: clientInfo?.brandName
                    };

                    // 3. AI Insights
                    const [openaiInsight, anthropicInsight, perplexityInsight] = await Promise.all([
                        this.openai.analyzePricing(product.title, dataContext, country).catch(e => `OpenAI Error: ${e.message}`),
                        this.anthropic.analyzeCompetition(product.title, dataContext, country).catch(e => `Anthropic Error: ${e.message}`),
                        this.perplexity.researchMarketTrends(product.title, country).catch(e => `Perplexity Error: ${e.message}`)
                    ]);

                    countryRecs[country] = {
                        competitorData,
                        insights: {
                            openai: openaiInsight,
                            anthropic: anthropicInsight,
                            perplexity: perplexityInsight
                        },
                        finalSuggestion: this.calculateFinalPrice(openaiInsight, competitorData)
                    };
                } catch (e) {
                    countryRecs[country] = { error: 'Failed' };
                }
            }

            productResults.push({
                product,
                recommendations: countryRecs
            });
        }

        return productResults;
    }

    private calculateFinalPrice(openaiInsight: any, competitorData: any[]) {
        try {
            if (typeof openaiInsight === 'string') {
                const parsed = JSON.parse(openaiInsight);
                if (parsed.suggested_price) return parsed.suggested_price;
            } else if (openaiInsight && openaiInsight.suggested_price) {
                return openaiInsight.suggested_price;
            }
        } catch (e) {
            console.warn('Could not parse OpenAI suggested_price, falling back to average.');
        }

        if (competitorData && competitorData.length > 0) {
            const avgPrice = competitorData.reduce((acc: number, curr: any) => acc + (curr.price || 0), 0) / competitorData.length;
            return avgPrice || 0;
        }

        return 0;
    }
}

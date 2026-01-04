import axios from 'axios';
import * as cheerio from 'cheerio';

export class WebAnalyzer {
    async fetchMetadata(url: string) {
        try {
            const { data } = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            const $ = cheerio.load(data);

            const title = $('title').text();
            const description = $('meta[name="description"]').attr('content') || '';

            // Attempt to find products
            const products: any[] = [];

            // Common product selectors (heuristic)
            $('[class*="product"], [class*="item"]').each((i, el) => {
                const itemTitle = $(el).find('[class*="title"], [class*="name"], h2, h3').first().text().trim();
                const priceText = $(el).find('[class*="price"]').first().text().trim();

                if (itemTitle && products.length < 5) {
                    products.push({
                        title: itemTitle,
                        price: priceText || 'N/A'
                    });
                }
            });

            // Fallback if no specific products found
            if (products.length === 0 && title) {
                products.push({
                    title: title.split('|')[0].trim(),
                    price: 'N/A'
                });
            }

            return {
                brandName: title.split('|')[0].trim(),
                description,
                products,
                url
            };
        } catch (error: any) {
            console.error(`Error fetching website data from ${url}:`, error.message);
            return {
                url,
                error: 'Could not fetch website data',
                brandName: 'Unknown',
                description: '',
                products: []
            };
        }
    }
}

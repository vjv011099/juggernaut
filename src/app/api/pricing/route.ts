import { NextRequest, NextResponse } from 'next/server';
import { PricingModelService } from '../../../services/pricing/pricing-model';

export async function POST(req: NextRequest) {
    try {
        const { category, countries, clientUrl } = await req.json();
        const service = new PricingModelService();
        const results = await service.generatePricingRecommendation(category, countries, clientUrl);

        return NextResponse.json(results);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

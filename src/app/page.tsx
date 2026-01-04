'use client';

import { useState } from 'react';

export default function Home() {
  const [category, setCategory] = useState('');
  const [clientUrl, setClientUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const countries = ['DE', 'UK', 'FR', 'IT', 'ES'];

  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, countries, clientUrl })
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 font-sans p-8 dark:bg-black">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">
          Juggernaut AI Pricing
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Global Execution Engine for European Market Expansion
        </p>
      </header>

      <main className="w-full max-w-4xl space-y-8">
        <section className="rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter Target Category (e.g., Kitchen Scales)"
              className="w-full rounded-lg border border-zinc-200 px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:border-zinc-800 dark:bg-black dark:text-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <input
              type="text"
              placeholder="Client Website URL (e.g., https://client-brand.com)"
              className="w-full rounded-lg border border-zinc-200 px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:border-zinc-800 dark:bg-black dark:text-white"
              value={clientUrl}
              onChange={(e) => setClientUrl(e.target.value)}
            />
            <button
              onClick={handleRunAnalysis}
              disabled={loading || !category}
              className="w-full rounded-lg bg-black px-8 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
            >
              {loading ? 'Analyzing...' : 'Run Analysis'}
            </button>
          </div>
        </section>

        {loading && (
          <div className="flex flex-col items-center gap-4 py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-black dark:border-zinc-800 dark:border-t-white" />
            <p className="text-zinc-500">Scraping Helium 10 & Generating AI Insights...</p>
          </div>
        )}

        {results && Array.isArray(results) && (
          <div className="space-y-16">
            {results.map((item: any, pIdx: number) => (
              <div key={pIdx} className="space-y-8">
                <div className="flex flex-col items-center text-center">
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    Analysis for: {item.product.title}
                  </h2>
                  <p className="text-zinc-500 text-sm">Targeting across Europe</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {countries.map((country) => {
                    const rec = item.recommendations[country];
                    if (!rec) return null;

                    return (
                      <div key={country} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold">{country}</h3>
                          <span className="text-2xl font-mono text-green-600">
                            €{typeof rec.finalSuggestion === 'number'
                              ? rec.finalSuggestion.toFixed(2)
                              : rec.finalSuggestion || '00.00'}
                          </span>
                        </div>

                        <div className="space-y-4 text-sm flex-1">
                          {rec.insights?.openai && (
                            <div className="border-t pt-3 dark:border-zinc-800">
                              <span className="font-semibold block mb-1">OpenAI Strategist:</span>
                              <div className="text-zinc-600 dark:text-zinc-400 text-xs italic">
                                {(() => {
                                  try {
                                    const parsed = typeof rec.insights.openai === 'string'
                                      ? JSON.parse(rec.insights.openai)
                                      : rec.insights.openai;
                                    return (
                                      <div>
                                        <p className="mb-2">{parsed.rationale}</p>
                                        <p className="font-bold text-green-600 dark:text-green-400">Winning Price: €{parsed.suggested_price}</p>
                                      </div>
                                    );
                                  } catch (e) {
                                    return <p>{rec.insights.openai}</p>;
                                  }
                                })()}
                              </div>
                            </div>
                          )}
                          {rec.insights?.anthropic && (
                            <div className="border-t pt-3 dark:border-zinc-800">
                              <span className="font-semibold block mb-1">Claude Positioning:</span>
                              <p className="text-zinc-600 dark:text-zinc-400 text-xs text-justify">
                                {typeof rec.insights.anthropic === 'string' ? rec.insights.anthropic : JSON.stringify(rec.insights.anthropic)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-zinc-200 py-8 text-center dark:border-zinc-800 w-full">
        <p className="text-xs text-zinc-400 font-mono tracking-widest uppercase">
          Powered by Juggernaut Execution Engine • 2026
        </p>
      </footer>
    </div>
  );
}

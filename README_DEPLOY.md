# Deployment Guide: Making Juggernaut Live 🚀

Follow these steps to deploy your AI Pricing Model to the web (Vercel).

## 1. Prepare your GitHub Repository
Vercel works best when your code is on GitHub.
1. Create a **Private** repository on [GitHub](https://github.com/new).
2. Initialize and push your project:
   ```bash
   git init
   git add .
   git commit -m "Prepare for deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/juggernaut.git
   git push -u origin main
   ```

## 2. Connect to Vercel
1. Go to [Vercel](https://vercel.com/new) and log in with your GitHub account.
2. Select your `juggernaut` repository.
3. In the **Environment Variables** section, copy the contents of your `.env` file:
   - `OPENAI_API_KEY`
   - `ANTHROPIC_API_KEY`
   - `PERPLEXITY_API_KEY`
   - `GEMINI_API_KEY`
   - `HELIUM10_EMAIL`
   - `HELIUM10_PASSWORD`
4. Click **Deploy**.

## 3. Important Considerations
- **Timeout**: The Helium 10 scraping and AI analysis can take 30-60 seconds. On the Vercel **Free Tier**, serverless functions have a 10-second timeout.
  - *Recommendation*: For complex multi-market analysis, you may need Vercel Pro (optional) or we can refactor the UI to fetch results market-by-market.
- **Bot Detection**: Helium 10 may challenge scraper logins. If the "Live" version fails, we can add cookie-based authentication.

## 4. Security
- **Warning**: Do not share your live URL with anyone you don't trust, as it uses your paid AI API credits.

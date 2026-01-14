# Sutra: A Simple Actuarial Blog

Sutra is a minimalist, AI-powered actuarial blog designed to deliver daily insights, technical challenges, and market pulse updates to its subscribers.

## 🚀 Getting Started

1.  **Environment Variables**: Ensure you have the following in your `.env.local`:
    - `RESEND_API_KEY`: For email delivery.
    - `RESEND_AUDIENCE_ID`: The target audience list for broadcasts.
    - `GEMINI_API_KEY`: To power the AI content generation.

2.  **Dev Server**:
    ```bash
    npm run dev
    ```

## 🏗️ Technical Architecture

### 1. Content Generation (`lib/gemini.ts`)
We use Google's **Gemini 1.5 Flash** to generate high-quality, structured JSON content for all daily broadcasts. Each broadcast type has a specialized prompt and structured schema to ensure consistency and professional tone.

### 2. Email Delivery (`lib/email.ts`)
Emails are sent using the **Resend Broadcast API**. This allows us to handle large lists efficiently with automatic unsubscribe management. The global email template maintains a strict minimalist aesthetic (Black/White/Gray).

### 3. Daily Broadcast Ecosystem
Each route generates content and triggers a broadcast:
- `/api/trivia`: Quick actuarial insights and "Sutra Facts".
- `/api/digest`: Top 3 latest articles from the blog.
- `/api/market-pulse`: Macro-economic and insurance trend analysis.
- `/api/code-sutra`: Technical modeling challenges with code snippets.
- `/api/genai-frontiers`: Deep-dives into AI agents and market trends.

## 🕰️ Cron Orchestration

To avoid **Vercel's Hobby Plan limits**, we use **GitHub Actions** as the external scheduler to ping our orchestrator at `/api/cron`.

- **Scheduler**: GitHub Action (`.github/workflows/cron.yml`) runs every 15 minutes (`*/15 * * * *`).
- **Orchestrator Logic**: The `/api/cron` route checks the current UTC time/day to trigger the correct broadcast.
- **Security**: The orchestrator is secured with a `CRON_SECRET`.
    
### 🔑 CRON_SECRET Setup Instructions

1.  **Generate a Secret**:
    Run this in your terminal to generate a secure string:
    ```bash
    openssl rand -base64 32
    ```

2.  **Add to Vercel**:
    - Go to your Project on the [Vercel Dashboard](https://vercel.com/dashboard).
    - Navigate to **Settings** > **Environment Variables**.
    - Add a new variable:
        - **Name**: `CRON_SECRET`
        - **Value**: (your generated secret)
    - Click **Save**. *Note: You may need to redeploy for the change to take effect.*

3.  **Add to GitHub**:
    - Go to your repository on GitHub.
    - Navigate to **Settings** > **Secrets and variables** > **Actions**.
    - Click **New repository secret**.
    - Add the secret:
        - **Name**: `CRON_SECRET`
        - **Value**: (the same generated secret)
    - Click **Add secret**.

### Broadcast Schedule (UTC)
| Task | UTC Window | Days |
| :--- | :--- | :--- |
| Trivia | 07:45 | Daily |
| Digest | 09:15 | Tue, Thu |
| Market Pulse | 11:30 | Mon, Wed, Fri |
| Code Sutra | 15:15 | Tue, Thu, Sat |
| GenAI Frontiers | 18:45 | Daily |

## 🛠️ Maintenance & Testing

### Manual Triggering
You can manually trigger any broadcast for testing by using the `force` and `secret` parameters:
```bash
curl "https://your-site.com/api/cron?force=market-pulse&secret=YOUR_CRON_SECRET"
```
*Available options for force: `trivia`, `digest`, `market-pulse`, `code-sutra`, `genai-frontiers`.*

### Adding New Broadcasts
1. Define the generation logic in `lib/gemini.ts`.
2. Create the API route in `app/api/[name]/route.ts` and export a named `trigger...Broadcast` function.
3. Register the new task in the Orchestrator (`app/api/cron/route.ts`) with its desired UTC window.
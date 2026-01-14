# Sutra: A Simple Actuarial Blog

Sutra is a minimalist, AI-powered actuarial blog designed to deliver daily insights, technical challenges, and market pulse updates to its subscribers.

## 🚀 Getting Started

1.  **Environment Variables**: Ensure you have the following in your `.env.local`:
    - `RESEND_API_KEY`: For email delivery.
    - `RESEND_AUDIENCE_ID`: The target audience list for broadcasts.
    - `GEMINI_API_KEY`: To power the AI content generation.
    - `CRON_SECRET`: A secure string to protect your orchestrator.

2.  **Dev Server**:
    ```bash
    npm run dev
    ```

## 🏗️ Technical Architecture

### 1. Content Generation (`lib/gemini.ts`)
We use Google's **Gemini 1.5 Flash** to generate high-quality, structured JSON content for all daily broadcasts.

### 2. Email Delivery (`lib/email.ts`)
Emails are sent using the **Resend Broadcast API** with a unified minimalist aesthetic.

### 3. Daily Broadcast Ecosystem
- `/api/trivia`: Daily actuarial insights.
- `/api/digest`: Periodic top article summaries.
- `/api/market-pulse`: Global trend analysis.
- `/api/code-sutra`: Technical modeling challenges.
- `/api/genai-frontiers`: AI and market deep-dives.

## 🕰️ Cron Orchestration

To avoid **Vercel's Hobby Plan limits**, we use **[cron-job.org](https://cron-job.org)** to ping our orchestrator at `/api/cron`.

- **Orchestrator Logic**: The `/api/cron` route checks the current UTC time/day to trigger the correct broadcast.
- **Security**: The orchestrator is secured with a `CRON_SECRET`.

### 🔑 Setup Instructions (cron-job.org)

1.  **Generate a Secret**:
    Run `openssl rand -base64 32` or create a secure string. Add it to Vercel as `CRON_SECRET`.

2.  **Configure cron-job.org**:
    - Create a new job.
    - **URL**: `https://your-site.com/api/cron?secret=YOUR_CRON_SECRET`
    - **Schedule**: Every 15 minutes (`0,15,30,45 * * * *`).
    - **Request Method**: GET.

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
```bash
curl "https://your-site.com/api/cron?force=market-pulse&secret=YOUR_CRON_SECRET"
```
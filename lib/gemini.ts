import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from environment variables
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const DEFAULT_MODEL = "gemini-3-flash-preview";
const GEMINI_MODEL = process.env.GEMINI_MODEL || DEFAULT_MODEL;

export async function generateSutraTrivia(retries = 3) {
  const prompt = `
    You are the AI editor for "Sutra" — a minimalist actuarial blog that makes complex ideas simple and human.

    YOUR MISSION: Synthesize insights from the LAST 7 DAYS (use current date as reference). FIRST, internally search web for "actuarial AI news last 7 days", "insurance tech breakthroughs past week", "agentic AI insurance 2026 recent" — cite 2-3 specific events, papers, or announcements with dates/sources.

    BRAND VOICE - "SUTRA" PHILOSOPHY:
    - "Sutra" means "thread" — weave recent developments into simple wisdom.
    - Minimalist, elegant, human-centered. Tagline: "Exploring numbers, AI, and the human side of tech."

    2026 CONTEXT: Agentic systems, reasoning models (o3, Claude Opus 4, Gemini 2.5 Pro), multi-agent orchestration, parametric insurance, actuaries as AI strategists — but ground EVERYTHING in last week's news.[web:38]

    RECENCY & UNIQUENESS:
    - Base ALL content on verifiable events from past 7 days (e.g., ISG AI study for insurance[web:39], actuarial recruiting trends[web:38]).
    - Vary angles: one run focus on cyber modeling, next on real-time underwriting.
    - No repeats: rotate examples, use fresh analogies.

    WRITING RULES:
    - Plain, punchy, conversational. Specific names/dates.
    - Hook with "This week, [company] announced [X]..."

    Format as JSON (exact structure):
    {
      "title": "Compelling title on 2026 breakthrough (max 10 words)",
      "breakingThread": {
        "heading": "Breaking Thread",
        "content": "Top development from last week. What/why/impact. 2-3 sentences."
      },
      "sutraFact": {
        "heading": "Sutra Fact",
        "content": "Surprising fact from recent news. 1-2 sentences."
      },
      "actuarysEdge": {
        "heading": "Actuary's Edge",
        "content": "Actionable AI tip tied to news. 1-2 sentences."
      }
    }

    Tone: Friendly visionary. ONLY JSON.

  `;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      const text = response.text;
      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }

      const cleanedText = text.replace(/```json|```/gi, "").trim();
      return JSON.parse(cleanedText);
    } catch (error: any) {
      const isRetryable = error?.status === 503 || error?.status === 429;

      if (isRetryable && i < retries - 1) {
        console.warn(
          `Gemini API overloaded (attempt ${i + 1}/${retries}). Retrying in ${Math.pow(2, i)}s...`,
        );
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 1000),
        );
        continue;
      }

      console.error("Gemini Generation Error:", error);
      throw new Error(
        `Failed to generate daily trivia content after ${i + 1} attempts`,
      );
    }
  }
}

export async function generateMarketPulse(retries = 3) {
  const prompt = `
    You are the Market Strategist for "Sutra" — distilling economic noise into signal.

    MISSION: LAST 7 DAYS economic insights. FIRST, search "economic news insurance impact last week 2026", "market moves actuarial trends recent", "central bank AI economy updates" — pull numbers/events.

    BRAND VOICE: Minimalist, human-centered. Economics affects lives.

    2026 LANDSCAPE: AI productivity, agentic economy, climate volatility, cyber insurance — prioritize this week's data.[web:45]

    RECENCY & UNIQUENESS:
    - Specific: earnings, data releases (e.g., health premiums up post-GST[web:45]).
    - Vary: one macro inflation, next cyber risk.
    - Real numbers/percentages from sources.

    WRITING RULES:
    - Relatable (groceries/jobs). Define terms.

    JSON (exact):
    {
      "title": "Specific economic headline (max 10 words)",
      "macroView": {
        "heading": "The Big Picture",
        "content": "Key market mover this week. 2 sentences."
      },
      "actuarialAngle": {
        "heading": "What It Means for Insurance",
        "content": "Premiums/claims impact. 1-2 sentences."
      },
      "riskRadar": {
        "heading": "Something to Watch",
        "content": "Under-the-radar risk. 1-2 sentences."
      }
    }

    Tone: Grounded advisor. ONLY JSON.

  `;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      const text = response.text;
      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }
      const cleanedText = text.replace(/```json|```/gi, "").trim();
      return JSON.parse(cleanedText);
    } catch (error: any) {
      if ((error?.status === 503 || error?.status === 429) && i < retries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 1000),
        );
        continue;
      }
      throw error;
    }
  }
}

export async function generateCodeSutra(retries = 3) {
  const prompt = `
    You are a coding mentor for "Sutra" — empowering pros with fresh AI skills.

    MISSION: ONE technique from LAST 7 DAYS. FIRST, search "AI coding updates last week", "Python libraries actuarial 2026 recent", "agentic code tools news" — feature new release/update.

    BRAND VOICE: Empowering, human-in-loop.

    2026 CODING: AI pair programming, SLMs, Polars/DuckDB, agentic workflows.[web:46]

    RECENCY & UNIQUENESS:
    - New: e.g., VS Code 1.108, Qwen3-VL[web:46].
    - Vary snippets: Python/SQL/prompting.
    - Metrics: "10x faster per benchmarks".

    WRITING RULES:
    - Problem → AI solution. Clean code.

    JSON (exact):
    {
      "title": "AI coding efficiency title (max 10 words)",
      "theChallenge": {
        "heading": "The Grind",
        "content": "Pain point. 1-2 sentences."
      },
      "sutraSnippet": {
        "heading": "The AI Workflow",
        "content": "Code/prompt in markdown.",
        "language": "python/sql/prompting"
      },
      "efficiencyGain": {
        "heading": "The Lever",
        "content": "Quantified win. 1-2 sentences."
      }
    }

    Tone: Shortcut-revealing mentor. ONLY JSON.

  `;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      const text = response.text;
      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }
      const cleanedText = text.replace(/```json|```/gi, "").trim();
      return JSON.parse(cleanedText);
    } catch (error: any) {
      if ((error?.status === 503 || error?.status === 429) && i < retries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 1000),
        );
        continue;
      }
      throw error;
    }
  }
}

export async function generateGenAIFrontiers(retries = 3) {
  const prompt = `
    Visionary analyst for "Sutra" — AI frontier made accessible.

    MISSION: Breakthroughs LAST 7 DAYS. FIRST, search "GenAI news last week 2026", "reasoning models updates", "agentic AI announcements" — cite specifics.

    BRAND VOICE: Visionary, grounded, human-centered.

    2026 FRONTIERS: Reasoning models, multi-modal agents, sovereign AI, safety.[web:44][web:43]

    RECENCY & UNIQUENESS:
    - Events: e.g., DeepSeek-R1 update[web:44], SOA AI reports[web:41].
    - Vary: tech → actuarial app.

    WRITING RULES:
    - Specific companies/models. Concrete examples.

    JSON (exact):
    {
      "title": "Visionary AI title (max 10 words)",
      "executiveSummary": {
        "heading": "The New Horizon",
        "content": "Biggest news. 2-3 sentences."
      },
      "deepDive": {
        "heading": "The Shift",
        "content": "Actuarial changes/examples. 5-7 sentences."
      },
      "marketPulse": {
        "heading": "The Players",
        "content": "Leaders/edge. 2-3 sentences."
      },
      "theVerdict": {
        "heading": "The Bottom Line",
        "content": "Key takeaway. 1 sentence."
      }
    }

    Tone: Exciting guide. ONLY JSON.

  `;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      const text = response.text;
      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }
      const cleanedText = text.replace(/```json|```/gi, "").trim();
      return JSON.parse(cleanedText);
    } catch (error: any) {
      if ((error?.status === 503 || error?.status === 429) && i < retries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 1000),
        );
        continue;
      }
      throw error;
    }
  }
}

export async function generateActuarialSimplified(retries = 3) {
  const prompt = `
    Warm mentor for "Sutra" — demystifying actuarial risks.

    MISSION: Concept in NEWS LAST 7 DAYS. FIRST, search "actuarial concepts news past week", "insurance risk trends 2026 recent" — link to event.

    BRAND VOICE: Illuminating threads to everyday.

    2026 CONCEPTS: Cyber modeling, parametric, longevity, real-time underwriting, climate, AI governance, embedded.[web:39][web:42]

    RECENCY & UNIQUENESS:
    - Hook: "Post-[event], here's [concept]..." e.g., ISG AI study[web:39].
    - Vary analogies.

    WRITING RULES:
    - No formulas. Vivid analogies.

    JSON (exact):
    {
      "title": "Analogy-based title",
      "theJargon": {
        "heading": "The Fancy Term",
        "content": "Definition. 1-2 sentences."
      },
      "realTalk": {
        "heading": "In Plain English",
        "content": "Analogy explanation. 2-3 sentences."
      },
      "whyItMatters": {
        "heading": "The 'So What?'",
        "content": "Real impact. 1-2 sentences."
      }
    }

    Tone: Conversational illuminator. ONLY JSON.

  `;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      const text = response.text;
      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }
      const cleanedText = text.replace(/```json|```/gi, "").trim();
      return JSON.parse(cleanedText);
    } catch (error: any) {
      if ((error?.status === 503 || error?.status === 429) && i < retries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 1000),
        );
        continue;
      }
      throw error;
    }
  }
}

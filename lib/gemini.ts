import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from environment variables
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const DEFAULT_MODEL = "gemini-3-flash-preview";
const GEMINI_MODEL = process.env.GEMINI_MODEL || DEFAULT_MODEL;

type TriviaPayload = {
  title: string;
  breakingThread: {
    heading: string;
    content: string;
  };
  sutraFact: {
    heading: string;
    content: string;
  };
  actuarysEdge: {
    heading: string;
    content: string;
  };
};

type MarketPulsePayload = {
  title: string;
  macroView: {
    heading: string;
    content: string;
  };
  actuarialAngle: {
    heading: string;
    content: string;
  };
  riskRadar: {
    heading: string;
    content: string;
  };
};

type CodeSutraPayload = {
  title: string;
  theChallenge: {
    heading: string;
    content: string;
  };
  sutraSnippet: {
    heading: string;
    content: string;
    language: string;
  };
  efficiencyGain: {
    heading: string;
    content: string;
  };
};

type GenAIFrontiersPayload = {
  title: string;
  executiveSummary: {
    heading: string;
    content: string;
  };
  deepDive: {
    heading: string;
    content: string;
  };
  marketPulse: {
    heading: string;
    content: string;
  };
  theVerdict: {
    heading: string;
    content: string;
  };
};

type ActuarialSimplifiedPayload = {
  title: string;
  theJargon: {
    heading: string;
    content: string;
  };
  realTalk: {
    heading: string;
    content: string;
  };
  whyItMatters: {
    heading: string;
    content: string;
  };
};

export type StreamId =
  | "trivia"
  | "market-pulse"
  | "code-sutra"
  | "genai-frontiers"
  | "actuarial-simplified";

async function callGeminiJson<T>(prompt: string, retries = 3): Promise<T> {
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
      return JSON.parse(cleanedText) as T;
    } catch (error: any) {
      const isRetryable = error?.status === 503 || error?.status === 429;

      if (isRetryable && i < retries - 1) {
        const delaySeconds = Math.pow(2, i);
        console.warn(
          `Gemini API overloaded (attempt ${i + 1}/${retries}). Retrying in ${delaySeconds}s...`,
        );
        await new Promise((resolve) =>
          setTimeout(resolve, delaySeconds * 1000),
        );
        continue;
      }

      console.error("Gemini Generation Error:", error);
      throw new Error(
        `Failed to generate content after ${i + 1} attempts`,
      );
    }
  }

  throw new Error("Failed to generate content after all retries");
}

export async function generateSutraTrivia(
  retries = 3,
): Promise<TriviaPayload> {
  const prompt = `
    You are the AI editor for "Sutra" — a minimalist actuarial blog that makes complex ideas simple and human.

    YOUR MISSION: Synthesize insights from the LAST 7 DAYS (use current date as reference).
    FIRST, internally search for recent news across:
      - global tech and AI/agentic-AI (US/EU/Asia where possible),
      - finance and macroeconomics,
      - insurance and reinsurance markets,
      - actuarial practice and regulation.
    From that search, anchor everything in 2–3 concrete events, papers, or announcements with dates and organizations (e.g., an insurer, reinsurer, regulator, or tech company).

    BRAND VOICE - "SUTRA" PHILOSOPHY:
    - "Sutra" means "thread" — weave recent developments into simple wisdom.
    - Minimalist, elegant, human-centered. Tagline: "Exploring numbers, AI, and the human side of tech."

    2026 CONTEXT: Agentic systems, reasoning models (o3, Claude Opus 4, Gemini 2.5 Pro), multi-agent orchestration, parametric insurance, actuaries as AI strategists — but ground EVERYTHING in last week's news and show why it matters for insurance and actuarial work.[web:38]

    RECENCY & UNIQUENESS:
    - Base ALL content on verifiable events from the past 7 days (e.g., ISG AI study for insurance[web:39], actuarial recruiting trends[web:38], a central-bank speech, a major AI product launch).
    - Explicitly connect at least one tech/AI event and one finance/economic event back to insurance or actuarial decision-making.
    - Vary angles each time: one run can focus on cyber modeling, another on pricing, another on capital or reserving.
    - No repeats: rotate companies, countries, and examples; use fresh analogies.

    WRITING RULES:
    - Plain, punchy, conversational. Use specific names/dates and at least one concrete number (percentage, count, or currency figure) where appropriate.
    - Hook with "This week, [company/regulator] announced [X]..." or a similarly concrete opening.

    Format as JSON (exact structure):
    {
      "title": "Compelling title on 2026 breakthrough (max 10 words)",
      "breakingThread": {
        "heading": "Top Story",
        "content": "Top development from last week, clearly tied to insurance or actuarial work. What/why/impact. 2-3 sentences."
      },
      "sutraFact": {
        "heading": "Did You Know?",
        "content": "Surprising fact from recent news (tech, finance, AI, agentic AI, or economics) and a one-sentence link back to insurance or risk. 1-2 sentences total."
      },
      "actuarysEdge": {
        "heading": "Your Takeaway",
        "content": "Actionable takeaway for actuaries or insurance leaders, grounded in the news above. 1-2 sentences."
      }
    }

    Tone: Friendly visionary. ONLY JSON.

  `;

  return callGeminiJson<TriviaPayload>(prompt, retries);
}

export async function generateMarketPulse(
  retries = 3,
): Promise<MarketPulsePayload> {
  const prompt = `
    You are the Market Strategist for "Sutra" — distilling economic noise into signal.

    MISSION: LAST 7 DAYS economic insights that matter for insurers and actuaries.
    FIRST, search:
      - "global economic news last week 2026" (US/EU/Asia),
      - "market moves insurance sector recent",
      - "central bank policy updates insurance impact",
      - "capital markets & catastrophe/insurance-linked securities last week".
    From that search, choose 1–2 key economic or market moves that have a clear insurance or actuarial implication.

    BRAND VOICE: Minimalist, human-centered. Economics affects lives.

    2026 LANDSCAPE: AI productivity, agentic economy, climate volatility, cyber risk, and regulatory shifts — prioritize this week's data.[web:45]

    RECENCY & UNIQUENESS:
    - Be specific: earnings, data releases, spreads, default or loss ratios, regulatory announcements (e.g., health premiums up post-GST[web:45]).
    - Vary: one run can focus on inflation, another on credit risk, another on climate or cyber.
    - Use at least one concrete number (percentage, index level, or currency amount) tied back to how insurers or actuaries might think about it.

    WRITING RULES:
    - Relatable (groceries/jobs) but always close the loop to insurance or actuarial decisions. Define terms briefly when they are technical.

    JSON (exact):
    {
      "title": "Specific economic headline (max 10 words)",
      "macroView": {
        "heading": "Market Overview",
        "content": "Key market mover this week, including at least one specific number and a hint of why insurers should care. 2 sentences."
      },
      "actuarialAngle": {
        "heading": "Insurance Impact",
        "content": "Premiums/claims/capital impact or product opportunities for insurers and actuaries. 1-2 sentences."
      },
      "riskRadar": {
        "heading": "On the Radar",
        "content": "Under-the-radar risk or second-order effect actuaries should monitor over the next 3–12 months. 1-2 sentences."
      }
    }

    Tone: Grounded advisor. ONLY JSON.

  `;

  return callGeminiJson<MarketPulsePayload>(prompt, retries);
}

export async function generateCodeSutra(
  retries = 3,
): Promise<CodeSutraPayload> {
  const prompt = `
    You are a coding mentor for "Sutra" — empowering pros with fresh AI skills.

    MISSION: ONE technique from LAST 7 DAYS that helps actuaries, risk engineers, or insurance data teams work faster.
    FIRST, search:
      - "AI coding updates last week",
      - "Python libraries actuarial or insurance 2026 recent",
      - "agentic code tools news",
      - "open source tooling for risk or insurance modeling".
    Feature one concrete release/update, benchmark, or workflow that is NEW or newly relevant.

    BRAND VOICE: Empowering, human-in-loop.

    2026 CODING: AI pair programming, SLMs, Polars/DuckDB, agentic workflows, actuarial modeling stacks.[web:46]

    RECENCY & UNIQUENESS:
    - Highlight something genuinely new or recently improved (e.g., VS Code 1.108, Qwen3-VL[web:46], a new data frame engine, or an agentic framework).
    - Vary snippets: Python/SQL/prompting, and explicitly bias examples to data work actuaries/insurance analysts do (pricing, reserving, simulation, portfolio analytics, reporting).
    - Include at least one rough metric or benefit (e.g., “10x faster than [prior approach] per benchmarks”).

    WRITING RULES:
    - Problem → AI solution → what changes for an actuary or insurance engineer. Clean code, idiomatic style.

    JSON (exact):
    {
      "title": "AI coding efficiency title (max 10 words)",
      "theChallenge": {
        "heading": "The Problem",
        "content": "Pain point for an actuary, insurance analyst, or risk engineer. 1-2 sentences."
      },
      "sutraSnippet": {
        "heading": "Try This",
        "content": "Code/prompt in markdown that directly helps with an insurance/actuarial or risk workflow.",
        "language": "python/sql/prompting"
      },
      "efficiencyGain": {
        "heading": "The Payoff",
        "content": "Quantified win or clear qualitative improvement (e.g., hours saved per week, faster what-if analysis, fewer manual errors). 1-2 sentences."
      }
    }

    Tone: Shortcut-revealing mentor. ONLY JSON.

  `;

  return callGeminiJson<CodeSutraPayload>(prompt, retries);
}

export async function generateGenAIFrontiers(
  retries = 3,
): Promise<GenAIFrontiersPayload> {
  const prompt = `
    Visionary analyst for "Sutra" — AI frontier made accessible.

    MISSION: Breakthroughs LAST 7 DAYS that shape how actuaries and insurers will use AI.
    FIRST, search:
      - "GenAI news last week 2026",
      - "reasoning models updates",
      - "agentic AI announcements",
      - "AI regulation and model risk news insurance 2026".
    Choose 1–2 particularly important updates that either:
      - change the capabilities/limits of AI, or
      - change the regulatory or risk landscape for using AI in insurance/finance.

    BRAND VOICE: Visionary, grounded, human-centered.

    2026 FRONTIERS: Reasoning models, multi-modal agents, sovereign AI, safety, AI governance, model risk management.[web:44][web:43]

    RECENCY & UNIQUENESS:
    - Use concrete events: e.g., DeepSeek-R1 update[web:44], SOA AI reports[web:41], new guidance from regulators, or large insurers announcing AI programs.
    - Vary: some weeks more technical (models/benchmarks), other weeks more strategic (operating model, regulation, ethics).

    WRITING RULES:
    - Name specific companies/models/regulators. Provide concrete actuarial or insurance examples (pricing, claims, fraud, capital, product design).

    JSON (exact):
    {
      "title": "Visionary AI title (max 10 words)",
      "executiveSummary": {
        "heading": "What Happened",
        "content": "Biggest news, framed for senior insurance leaders and actuaries, with at least one specific detail (model name, organization, or regulation). 2-3 sentences."
      },
      "deepDive": {
        "heading": "Why It Matters",
        "content": "Actuarial and insurance changes/examples: show how workflows, products, or risk management could change. 5-7 sentences."
      },
      "marketPulse": {
        "heading": "Who's Leading",
        "content": "Leaders/edge: which companies or regions are moving fastest, and where insurers/actuaries might partner or learn. 2-3 sentences."
      },
      "theVerdict": {
        "heading": "Key Takeaway",
        "content": "Key takeaway for an actuary or insurance executive in one clear sentence."
      }
    }

    Tone: Exciting guide. ONLY JSON.

  `;

  return callGeminiJson<GenAIFrontiersPayload>(prompt, retries);
}

export async function generateActuarialSimplified(
  retries = 3,
): Promise<ActuarialSimplifiedPayload> {
  const prompt = `
    Warm mentor for "Sutra" — demystifying actuarial risks.

    MISSION: Concept in NEWS LAST 7 DAYS.
    FIRST, search:
      - "actuarial concepts news past week",
      - "insurance risk trends 2026 recent",
      - "climate or cyber events insurance impact last week",
      - "regulatory capital or solvency changes recent".
    Link the concept to a specific recent event (e.g., a climate catastrophe, cyber incident, regulatory paper, or product launch).

    BRAND VOICE: Illuminating threads to everyday.

    2026 CONCEPTS: Cyber modeling, parametric insurance, longevity and health, real-time underwriting, climate risk, AI governance, embedded insurance.[web:39][web:42]

    RECENCY & UNIQUENESS:
    - Hook: "Post-[event], here's [concept]..." e.g., ISG AI study[web:39], a flood or wildfire, a cyber outage, or a new solvency rule.
    - Vary analogies and rotate concepts (do not repeat the same example in consecutive issues).

    WRITING RULES:
    - No formulas. Vivid analogies grounded in everyday life (family, jobs, money, health) so a non-actuary could still understand why this matters.

    JSON (exact):
    {
      "title": "Analogy-based title",
      "theJargon": {
        "heading": "What Is It?",
        "content": "Definition in simple language, optionally naming the recent news event that makes it relevant right now. 1-2 sentences."
      },
      "realTalk": {
        "heading": "In Plain English",
        "content": "Analogy explanation that compares the concept to something familiar (e.g., household budgeting, weather forecasts, seatbelts). 2-3 sentences."
      },
      "whyItMatters": {
        "heading": "Real-World Impact",
        "content": "Real impact for customers, insurers, or society: how prices, coverage, or risk change. 1-2 sentences."
      }
    }

    Tone: Conversational illuminator. ONLY JSON.

  `;

  return callGeminiJson<ActuarialSimplifiedPayload>(prompt, retries);
}

export async function generateStreamContent(
  id: StreamId,
  retries = 3,
) {
  switch (id) {
    case "trivia":
      return generateSutraTrivia(retries);
    case "market-pulse":
      return generateMarketPulse(retries);
    case "code-sutra":
      return generateCodeSutra(retries);
    case "genai-frontiers":
      return generateGenAIFrontiers(retries);
    case "actuarial-simplified":
      return generateActuarialSimplified(retries);
    default:
      throw new Error(`Unsupported stream id: ${id}`);
  }
}

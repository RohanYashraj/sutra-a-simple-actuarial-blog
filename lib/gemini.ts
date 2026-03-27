import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from environment variables
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const DEFAULT_MODEL = "gemini-3-flash-preview";
const GEMINI_MODEL = process.env.GEMINI_MODEL || DEFAULT_MODEL;
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || "gemini-2.5-flash";
const FRESHNESS_WINDOW_DAYS = Number(process.env.GEMINI_FRESHNESS_DAYS || 7);

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

type SourceHint = {
  name: string;
  url: string;
  focus: string;
};

type SectionSchema = {
  heading: string;
  content: string;
  language?: string;
};

type SchemaDefinition = {
  requiredTopLevel: string[];
  sections: string[];
  sectionRules: Record<string, { requiresLanguage?: boolean }>;
  titleMaxChars: number;
};

const SOURCE_HINTS: Record<StreamId, SourceHint[]> = {
  trivia: [
    {
      name: "SOA",
      url: "https://www.soa.org/",
      focus: "actuarial practice updates and research publications",
    },
    {
      name: "IAIS",
      url: "https://www.iaisweb.org/",
      focus: "insurance supervisory and global regulatory developments",
    },
    {
      name: "OECD",
      url: "https://www.oecd.org/",
      focus: "macro policy signals with insurance impact",
    },
    {
      name: "Bank for International Settlements",
      url: "https://www.bis.org/",
      focus: "financial stability and systemic risk signals",
    },
  ],
  "market-pulse": [
    {
      name: "Federal Reserve",
      url: "https://www.federalreserve.gov/",
      focus: "interest rates, inflation and financial conditions",
    },
    {
      name: "ECB",
      url: "https://www.ecb.europa.eu/",
      focus: "euro area monetary policy and market stance",
    },
    {
      name: "IMF",
      url: "https://www.imf.org/",
      focus: "global growth and risk outlook updates",
    },
    {
      name: "Swiss Re Institute",
      url: "https://www.swissre.com/institute.html",
      focus: "insurance market and catastrophe trend research",
    },
  ],
  "code-sutra": [
    {
      name: "Python Release Notes",
      url: "https://docs.python.org/3/whatsnew/",
      focus: "language/runtime updates relevant for analytics workflows",
    },
    {
      name: "Pandas Docs",
      url: "https://pandas.pydata.org/docs/whatsnew/",
      focus: "data engineering and dataframe workflow improvements",
    },
    {
      name: "Polars",
      url: "https://pola.rs/",
      focus: "high-performance data processing tools for analytics teams",
    },
    {
      name: "Google AI Developers Blog",
      url: "https://developers.googleblog.com/en/category/generative-ai/",
      focus: "GenAI engineering and tooling improvements",
    },
  ],
  "genai-frontiers": [
    {
      name: "Google DeepMind Blog",
      url: "https://deepmind.google/discover/blog/",
      focus: "frontier model capabilities and safety updates",
    },
    {
      name: "OpenAI",
      url: "https://openai.com/news/",
      focus: "model and platform capability releases",
    },
    {
      name: "Anthropic",
      url: "https://www.anthropic.com/news",
      focus: "reasoning, safety and enterprise AI capabilities",
    },
    {
      name: "NIST AI",
      url: "https://www.nist.gov/artificial-intelligence",
      focus: "governance and model risk management guidance",
    },
  ],
  "actuarial-simplified": [
    {
      name: "CAS",
      url: "https://www.casact.org/",
      focus: "property/casualty actuarial methods and updates",
    },
    {
      name: "NAIC",
      url: "https://content.naic.org/",
      focus: "insurance regulation and solvency developments",
    },
    {
      name: "Lloyd's",
      url: "https://www.lloyds.com/",
      focus: "market developments in specialty and catastrophe insurance",
    },
    {
      name: "Munich Re Topics",
      url: "https://www.munichre.com/en/insights.html",
      focus: "climate, cyber and emerging insurance risk themes",
    },
  ],
};

const STREAM_SCHEMAS: Record<StreamId, SchemaDefinition> = {
  trivia: {
    requiredTopLevel: ["title", "breakingThread", "sutraFact", "actuarysEdge"],
    sections: ["breakingThread", "sutraFact", "actuarysEdge"],
    sectionRules: {},
    titleMaxChars: 75,
  },
  "market-pulse": {
    requiredTopLevel: ["title", "macroView", "actuarialAngle", "riskRadar"],
    sections: ["macroView", "actuarialAngle", "riskRadar"],
    sectionRules: {},
    titleMaxChars: 75,
  },
  "code-sutra": {
    requiredTopLevel: ["title", "theChallenge", "sutraSnippet", "efficiencyGain"],
    sections: ["theChallenge", "sutraSnippet", "efficiencyGain"],
    sectionRules: {
      sutraSnippet: { requiresLanguage: true },
    },
    titleMaxChars: 75,
  },
  "genai-frontiers": {
    requiredTopLevel: [
      "title",
      "executiveSummary",
      "deepDive",
      "marketPulse",
      "theVerdict",
    ],
    sections: ["executiveSummary", "deepDive", "marketPulse", "theVerdict"],
    sectionRules: {},
    titleMaxChars: 75,
  },
  "actuarial-simplified": {
    requiredTopLevel: ["title", "theJargon", "realTalk", "whyItMatters"],
    sections: ["theJargon", "realTalk", "whyItMatters"],
    sectionRules: {},
    titleMaxChars: 75,
  },
};

function formatSourceHints(streamId: StreamId): string {
  return SOURCE_HINTS[streamId]
    .map(
      (s, idx) =>
        `${idx + 1}. ${s.name} (${s.url}) - Focus: ${s.focus}. Prefer updates from the last ${FRESHNESS_WINDOW_DAYS} days.`,
    )
    .join("\n");
}

function getFreshnessContext(streamId: StreamId) {
  const now = new Date();
  const isoDate = now.toISOString().slice(0, 10);
  const start = new Date(
    now.getTime() - FRESHNESS_WINDOW_DAYS * 24 * 60 * 60 * 1000,
  )
    .toISOString()
    .slice(0, 10);

  return {
    today: isoDate,
    since: start,
    sourceBrief: formatSourceHints(streamId),
  };
}

function parseJsonBlock(text: string) {
  const cleanedText = text.replace(/```json|```/gi, "").trim();
  return JSON.parse(cleanedText) as unknown;
}

function sectionHasContent(section: unknown): section is SectionSchema {
  if (!section || typeof section !== "object") return false;
  const s = section as SectionSchema;
  return Boolean(
    typeof s.heading === "string" &&
      s.heading.trim() &&
      typeof s.content === "string" &&
      s.content.trim(),
  );
}

function validatePayload(
  streamId: StreamId,
  payload: unknown,
): payload is
  | TriviaPayload
  | MarketPulsePayload
  | CodeSutraPayload
  | GenAIFrontiersPayload
  | ActuarialSimplifiedPayload {
  if (!payload || typeof payload !== "object") return false;
  const schema = STREAM_SCHEMAS[streamId];
  const obj = payload as Record<string, unknown>;

  if (
    typeof obj.title !== "string" ||
    !obj.title.trim() ||
    obj.title.length > schema.titleMaxChars
  ) {
    return false;
  }

  for (const field of schema.requiredTopLevel) {
    if (!(field in obj)) return false;
  }

  for (const sectionName of schema.sections) {
    const section = obj[sectionName];
    if (!sectionHasContent(section)) return false;

    const rules = schema.sectionRules[sectionName];
    if (rules?.requiresLanguage) {
      const language = (section as SectionSchema).language;
      if (!language || typeof language !== "string" || !language.trim()) {
        return false;
      }
    }
  }

  return true;
}

function fallbackPayload(streamId: StreamId) {
  switch (streamId) {
    case "trivia":
      return {
        title: "This Week in Risk and AI",
        breakingThread: {
          heading: "Top Story",
          content:
            "A new wave of AI and market updates is reshaping how insurers price and monitor risk. Teams that combine current data with actuarial discipline are moving faster.",
        },
        sutraFact: {
          heading: "Did You Know?",
          content:
            "Small changes in claims frequency assumptions can materially shift reserve and capital outcomes. This week, keep your scenario ranges wide and grounded in current signals.",
        },
        actuarysEdge: {
          heading: "Your Takeaway",
          content:
            "Use one fresh external data point this week to challenge your base-case assumption before model sign-off.",
        },
      } satisfies TriviaPayload;
    case "market-pulse":
      return {
        title: "Market Signals Insurers Should Not Ignore",
        macroView: {
          heading: "Market Overview",
          content:
            "Recent macro signals suggest volatility in rates and risk sentiment is still elevated. Insurers should stress pricing and reserve assumptions under multiple paths.",
        },
        actuarialAngle: {
          heading: "Insurance Impact",
          content:
            "Higher uncertainty can pressure both investment returns and claims cost trajectories, making assumption governance critical.",
        },
        riskRadar: {
          heading: "On the Radar",
          content:
            "Watch second-order effects on lapse behavior and credit-sensitive portfolios over the next two quarters.",
        },
      } satisfies MarketPulsePayload;
    case "code-sutra":
      return {
        title: "A Faster Workflow for Risk Analytics",
        theChallenge: {
          heading: "The Problem",
          content:
            "Actuarial teams often spend too much time manually reshaping data before real analysis begins.",
        },
        sutraSnippet: {
          heading: "Try This",
          content:
            "Use a reusable data-quality check function at ingestion to flag missing keys, outliers, and schema drift before modeling.",
          language: "python",
        },
        efficiencyGain: {
          heading: "The Payoff",
          content:
            "Automating validation upfront reduces rework and helps teams spend more time on scenario insights.",
        },
      } satisfies CodeSutraPayload;
    case "genai-frontiers":
      return {
        title: "What New AI Progress Means for Insurance",
        executiveSummary: {
          heading: "What Happened",
          content:
            "Frontier AI capabilities continue to improve in reasoning and automation. Insurance teams can use this to compress cycle time in analysis-heavy workflows.",
        },
        deepDive: {
          heading: "Why It Matters",
          content:
            "Better model reasoning can support faster research, triage, and drafting for actuarial and risk operations when controlled with governance. The opportunity is highest where decisions are data-rich and process-heavy, such as pricing support, portfolio monitoring, and claims triage. Teams should pair capability gains with robust review checkpoints and model risk controls.",
        },
        marketPulse: {
          heading: "Who's Leading",
          content:
            "Organizations investing early in AI governance plus domain-specific workflows are capturing the strongest practical value.",
        },
        theVerdict: {
          heading: "Key Takeaway",
          content:
            "Adopt AI where it shortens decision cycles, but anchor every deployment in clear actuarial accountability.",
        },
      } satisfies GenAIFrontiersPayload;
    case "actuarial-simplified":
      return {
        title: "Why Assumptions Matter More Than Models",
        theJargon: {
          heading: "What Is It?",
          content:
            "Assumption risk is the chance that your inputs are wrong even when your model is mathematically correct.",
        },
        realTalk: {
          heading: "In Plain English",
          content:
            "A model is like a GPS: if your destination or current location is wrong, the route looks precise but still takes you to the wrong place.",
        },
        whyItMatters: {
          heading: "Real-World Impact",
          content:
            "For customers and insurers, better assumptions mean fairer pricing, steadier reserves, and fewer surprises.",
        },
      } satisfies ActuarialSimplifiedPayload;
  }
}

function withJitterDelay(attempt: number) {
  const baseMs = Math.pow(2, attempt) * 1000;
  const jitterMs = Math.floor(Math.random() * 400);
  return new Promise((resolve) => setTimeout(resolve, baseMs + jitterMs));
}

async function callGeminiJson<T>(
  streamId: StreamId,
  prompt: string,
  retries = 3,
): Promise<T> {
  const models = [GEMINI_MODEL, FALLBACK_MODEL];

  for (let i = 0; i < retries; i++) {
    try {
      const model = models[i % models.length];
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      const text = response.text;
      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }

      const parsed = parseJsonBlock(text);
      if (validatePayload(streamId, parsed)) {
        return parsed as T;
      }

      // One repair attempt if structure is off.
      const repairPrompt = `
You returned invalid JSON for stream "${streamId}".
Fix it to match the exact required schema.
Rules:
- Return ONLY valid JSON
- Keep all required keys and section headings
- No markdown fences

Original response:
${text}
      `;
      const repaired = await ai.models.generateContent({
        model,
        contents: repairPrompt,
      });
      const repairedText = repaired.text;
      if (!repairedText) {
        throw new Error("Repair pass returned empty response.");
      }
      const repairedParsed = parseJsonBlock(repairedText);
      if (validatePayload(streamId, repairedParsed)) {
        return repairedParsed as T;
      }
      throw new Error("Model response failed schema validation.");
    } catch (error: any) {
      const isRetryable = error?.status === 503 || error?.status === 429;

      if (isRetryable && i < retries - 1) {
        console.warn(
          `Gemini API overloaded (attempt ${i + 1}/${retries}). Retrying with backoff...`,
        );
        await withJitterDelay(i);
        continue;
      }

      console.error("Gemini Generation Error:", error);
      if (i < retries - 1) {
        await withJitterDelay(i);
        continue;
      }
      return fallbackPayload(streamId) as T;
    }
  }

  return fallbackPayload(streamId) as T;
}

function buildSharedPrompt(
  streamId: StreamId,
  mission: string,
  schemaTemplate: string,
  styleRules: string,
) {
  const freshness = getFreshnessContext(streamId);

  return `
You are the content engine for Sutra (actuarial + AI newsletter).
Current date (UTC): ${freshness.today}
Freshness window: ${freshness.since} to ${freshness.today}

Primary mission:
${mission}

Curated source hints (high trust, latest-first):
${freshness.sourceBrief}

Critical output requirements:
- Use current, concrete developments from the freshness window whenever possible.
- Include named organizations, products, or regulators where relevant.
- Keep claims grounded and practical for actuaries/insurance professionals.
- Avoid repeating examples from prior weeks; favor novelty.
- Use precise, concise language. No hype.
- Return ONLY JSON matching the schema below.

Schema (exact keys):
${schemaTemplate}

Style constraints:
${styleRules}
`;
}

export async function generateSutraTrivia(
  retries = 3,
): Promise<TriviaPayload> {
  const prompt = buildSharedPrompt(
    "trivia",
    "Create one sharp weekly Sutra Trivia issue that links current AI + macro + insurance signals to an actionable actuarial takeaway.",
    `{
  "title": "max 10 words",
  "breakingThread": { "heading": "Top Story", "content": "2-3 sentences" },
  "sutraFact": { "heading": "Did You Know?", "content": "1-2 sentences" },
  "actuarysEdge": { "heading": "Your Takeaway", "content": "1-2 sentences" }
}`,
    "- Friendly, clean, and insightful\n- At least one concrete number in the response\n- Mention at least one named institution or company",
  );

  return callGeminiJson<TriviaPayload>("trivia", prompt, retries);
}

export async function generateMarketPulse(
  retries = 3,
): Promise<MarketPulsePayload> {
  const prompt = buildSharedPrompt(
    "market-pulse",
    "Distill last-week market and policy developments into insurer-relevant signal with clear actuarial implications.",
    `{
  "title": "max 10 words",
  "macroView": { "heading": "Market Overview", "content": "2 sentences" },
  "actuarialAngle": { "heading": "Insurance Impact", "content": "1-2 sentences" },
  "riskRadar": { "heading": "On the Radar", "content": "1-2 sentences" }
}`,
    "- Grounded strategist tone\n- Include at least one number and one policy/market actor\n- Keep language practical and concise",
  );

  return callGeminiJson<MarketPulsePayload>("market-pulse", prompt, retries);
}

export async function generateCodeSutra(
  retries = 3,
): Promise<CodeSutraPayload> {
  const prompt = buildSharedPrompt(
    "code-sutra",
    "Teach one fresh, immediately usable coding pattern for actuarial/insurance data work.",
    `{
  "title": "max 10 words",
  "theChallenge": { "heading": "The Problem", "content": "1-2 sentences" },
  "sutraSnippet": {
    "heading": "Try This",
    "content": "code or prompt text",
    "language": "python/sql/prompting"
  },
  "efficiencyGain": { "heading": "The Payoff", "content": "1-2 sentences" }
}`,
    "- Mentor tone, no fluff\n- Must be directly usable for actuarial/insurance analytics\n- Quantify expected efficiency gain where possible",
  );

  return callGeminiJson<CodeSutraPayload>("code-sutra", prompt, retries);
}

export async function generateGenAIFrontiers(
  retries = 3,
): Promise<GenAIFrontiersPayload> {
  const prompt = buildSharedPrompt(
    "genai-frontiers",
    "Explain one to two major weekly GenAI frontier developments and what they change for insurance and actuarial leadership.",
    `{
  "title": "max 10 words",
  "executiveSummary": { "heading": "What Happened", "content": "2-3 sentences" },
  "deepDive": { "heading": "Why It Matters", "content": "5-7 sentences" },
  "marketPulse": { "heading": "Who's Leading", "content": "2-3 sentences" },
  "theVerdict": { "heading": "Key Takeaway", "content": "1 sentence" }
}`,
    "- Visionary but evidence-led\n- Include named models/orgs/regulators\n- Tie each point to practical insurance workflow impact",
  );

  return callGeminiJson<GenAIFrontiersPayload>(
    "genai-frontiers",
    prompt,
    retries,
  );
}

export async function generateActuarialSimplified(
  retries = 3,
): Promise<ActuarialSimplifiedPayload> {
  const prompt = buildSharedPrompt(
    "actuarial-simplified",
    "Simplify one currently relevant actuarial concept and tie it to a recent real-world insurance or risk signal.",
    `{
  "title": "analogy-led short title",
  "theJargon": { "heading": "What Is It?", "content": "1-2 sentences" },
  "realTalk": { "heading": "In Plain English", "content": "2-3 sentences" },
  "whyItMatters": { "heading": "Real-World Impact", "content": "1-2 sentences" }
}`,
    "- Warm, plain-English mentor tone\n- Avoid formulas and jargon-heavy explanations\n- Use one concrete recent event or development",
  );

  return callGeminiJson<ActuarialSimplifiedPayload>(
    "actuarial-simplified",
    prompt,
    retries,
  );
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

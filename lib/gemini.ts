import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from environment variables
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const DEFAULT_MODEL = "gemini-3-flash-preview";
const GEMINI_MODEL = process.env.GEMINI_MODEL || DEFAULT_MODEL;

export async function generateSutraTrivia(retries = 3) {
  const prompt = `
    You are the AI editor for "Sutra" — a minimalist actuarial blog that makes complex ideas simple and human.
    
    YOUR MISSION: Deliver insights from the LAST 7 DAYS — the freshest news, breakthroughs, and developments.
    Write for EVERYONE — curious students, busy professionals, and tech enthusiasts alike.

    BRAND VOICE - "SUTRA" PHILOSOPHY:
    - "Sutra" means "thread" — we weave complex ideas into simple, connected wisdom.
    - Minimalist and elegant. Every word earns its place.
    - Human-centered. Technology serves people, not the other way around.
    - Tagline: "Exploring numbers, AI, and the human side of tech."

    2026 LANDSCAPE (Background context — but always prioritize LAST WEEK'S news):
    - AI has evolved from chatbots to "Agentic Systems" — AI that plans, reasons, and executes multi-step tasks.
    - "Reasoning Models" (o3, Claude Opus 4, Gemini 2.5 Pro) are the new standard for logic-heavy work.
    - Multi-agent orchestration is mainstream — AI teams collaborating on complex workflows.
    - Climate-linked parametric insurance, real-time underwriting, and cyber risk modeling are peak trends.
    - Actuaries are becoming "AI strategists" — orchestrating models rather than building them manually.
    
    ⚡ RECENCY IS CRITICAL:
    - Your content MUST be based on news, announcements, or developments from the PAST 7 DAYS.
    - Reference specific recent events: product launches, research papers, company announcements, regulatory updates.
    - If you cannot find something from the last week, use the most recent available development.
    - Avoid generic or timeless content — readers want to know what's NEW this week.
    
    WRITING RULES:
    - Plain language. No jargon without explanation.
    - Short, punchy sentences. One idea per sentence.
    - Conversational — like explaining to a smart friend over coffee.
    - Specific and concrete. Name tools, companies, or techniques.
    - Start strong — no "In today's world..." or "As we all know..."
    
    Format your response as a JSON object with the following structure:
    {
      "title": "A compelling, specific title about a 2026 breakthrough or insight (max 10 words)",
      "breakingThread": {
        "heading": "Breaking Thread",
        "content": "The most significant development in Agentic AI, reasoning models, or insurance tech RIGHT NOW. What happened? Why does it matter? 2-3 crisp sentences that hook the reader."
      },
      "sutraFact": {
        "heading": "Sutra Fact",
        "content": "A surprising, memorable fact about numbers, risk, or how AI transformed something unexpected. Think 'dinner party conversation starter'. 1-2 sentences."
      },
      "actuarysEdge": {
        "heading": "Actuary's Edge",
        "content": "One actionable tip using AI Agents, Python, SQL, or reasoning tools. Be specific: 'Use [tool] to [do X] in [timeframe]' or 'Ask your reasoning model to [specific task]'. 1-2 sentences."
      }
    }

    Tone: Friendly, visionary, and clear. A smart friend who distills complexity into clarity.
    Return ONLY the JSON object.
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
        console.warn(`Gemini API overloaded (attempt ${i + 1}/${retries}). Retrying in ${Math.pow(2, i)}s...`);
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        continue;
      }

      console.error("Gemini Generation Error:", error);
      throw new Error(`Failed to generate daily trivia content after ${i + 1} attempts`);
    }
  }
}

export async function generateMarketPulse(retries = 3) {
  const prompt = `
    You are the Market Strategist for "Sutra" — a minimalist blog that makes economic complexity accessible.
    
    YOUR MISSION: Deliver economic insights from the LAST 7 DAYS — the week's biggest market moves and developments.

    BRAND VOICE - "SUTRA" PHILOSOPHY:
    - Minimalist and elegant. Cut the noise, keep the signal.
    - Human-centered. Economics is about people's lives, not abstract numbers.
    - "Exploring numbers, AI, and the human side of tech."

    2026 ECONOMIC LANDSCAPE (Background context — but prioritize LAST WEEK'S news):
    - AI-driven productivity gains reshaping job markets and corporate earnings.
    - Energy transition costs and climate-linked economic volatility.
    - The "Agentic Economy" — AI agents handling transactions, negotiations, and financial operations.
    - Insurance markets responding to cyber risk, longevity shifts, and parametric products.
    - Central banks navigating AI inflation effects and labor market transformations.

    ⚡ RECENCY IS CRITICAL:
    - Your content MUST be based on market news from the PAST 7 DAYS.
    - Reference specific recent events: earnings reports, central bank decisions, regulatory announcements, economic data releases.
    - Include actual numbers and percentages when available from this week.
    - Avoid generic commentary — readers want THIS WEEK'S market pulse.

    WRITING RULES:
    - No jargon without immediate explanation. Define "yield," "liquidity," "spread" if used.
    - Relatable examples: rent, groceries, job security, retirement savings.
    - Specific numbers and percentages when available.
    - Start strong — no generic intros.
    
    Format your response as a JSON object:
    {
      "title": "A specific, compelling headline about current economic developments (max 10 words)",
      "macroView": {
        "heading": "The Big Picture",
        "content": "The most important economic development RIGHT NOW. What's moving markets? What's the headline everyone should understand? 2 crisp sentences."
      },
      "actuarialAngle": {
        "heading": "What It Means for Insurance",
        "content": "How does this economic shift affect insurance premiums, claims patterns, or risk modeling? Specific, practical implications. 1-2 sentences."
      },
      "riskRadar": {
        "heading": "Something to Watch",
        "content": "One underappreciated risk on the horizon — AI compute constraints, supply chain fragility, regulatory shifts. Why should readers pay attention? 1-2 sentences."
      }
    }

    Tone: Clear, grounded, and forward-looking. A trusted advisor who cuts through market noise.
    Return ONLY the JSON object.
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
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        continue;
      }
      throw error;
    }
  }
}

export async function generateCodeSutra(retries = 3) {
  const prompt = `
    You are a friendly coding mentor for "Sutra" — a minimalist blog empowering professionals with AI-augmented skills.
    
    YOUR MISSION: Teach ONE practical coding technique featuring tools, libraries, or AI features from the LAST 7 DAYS.

    BRAND VOICE - "SUTRA" PHILOSOPHY:
    - Empowering and practical. Every tip should feel like unlocking a superpower.
    - Human-in-the-loop focus. AI assists; humans direct and decide.
    - "Exploring numbers, AI, and the human side of tech."

    2026 CODING LANDSCAPE (Background — but prioritize RECENT tool updates and techniques):
    - AI Pair Programming is standard — developers work WITH reasoning models and code agents.
    - Small Language Models (SLMs) run locally for privacy-sensitive or offline work.
    - Modern libraries dominate: Polars > Pandas for data, DuckDB for analytics, Rust for performance-critical code.
    - "Agentic Workflows" chain multiple AI steps: research → code → test → deploy.
    - Prompt engineering is a core skill — how you ask determines what you get.

    ⚡ RECENCY IS CRITICAL:
    - Feature a technique, library update, or AI capability that's NEW or trending in the PAST 7 DAYS.
    - Reference recent tool releases, version updates, or newly discovered best practices.
    - Show readers something FRESH they likely haven't seen yet.

    WRITING RULES:
    - Explain the problem before the solution.
    - Use modern tools: Polars, DuckDB, uv for Python, reasoning models for logic.
    - Show efficiency gains with specific metrics when possible (10x faster, zero bugs, 5 minutes vs 2 hours).
    - Treat code as poetry — clean, commented where needed, zero clutter.
    
    Format your response as a JSON object:
    {
      "title": "A compelling title about AI-powered coding efficiency (max 10 words)",
      "theChallenge": {
        "heading": "The Grind",
        "content": "What tedious task did everyone hate doing manually? Describe the frustration in 1-2 sentences. Make readers nod in recognition."
      },
      "sutraSnippet": {
        "heading": "The AI Workflow",
        "content": "A concise code snippet OR a specialized prompting technique. Use markdown code blocks. Show the elegant AI-assisted solution.",
        "language": "python, sql, or prompting"
      },
      "efficiencyGain": {
        "heading": "The Lever",
        "content": "Quantify the win. How much faster? How many fewer errors? What can they do with the saved time? 1-2 punchy sentences."
      }
    }

    Tone: Empowering and practical. Like a mentor revealing a shortcut that changes everything.
    Return ONLY the JSON object.
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
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        continue;
      }
      throw error;
    }
  }
}

export async function generateGenAIFrontiers(retries = 3) {
  const prompt = `
    You are a visionary tech analyst for "Sutra" — a minimalist blog that makes the AI frontier accessible.
    
    YOUR MISSION: Explain AI breakthroughs from the LAST 7 DAYS — this week's biggest announcements and developments.

    BRAND VOICE - "SUTRA" PHILOSOPHY:
    - Visionary yet grounded. Show the future, but keep feet on earth.
    - Human-centered. AI serves humanity, not the reverse.
    - "Exploring numbers, AI, and the human side of tech."

    2026 AI FRONTIERS (Background context — but prioritize LAST WEEK'S announcements):
    - Reasoning Models: o3, Claude Opus 4, Gemini 2.5 Pro — system-2 thinking, chain-of-thought reasoning, formal verification.
    - Multi-Modal Agents: AI that sees, hears, reads documents, browses web, and takes action.
    - Agentic Orchestration: Manager agents delegating to specialist sub-agents for complex workflows.
    - Sovereign AI & Edge Compute: On-device SLMs, privacy-first AI, local reasoning without cloud dependencies.
    - AI Safety & Alignment: Constitutional AI, RLHF improvements, interpretability research.
    - Real-time AI Applications: Live underwriting, fraud detection, autonomous code review, dynamic pricing.

    ⚡ RECENCY IS CRITICAL:
    - Your content MUST be based on AI news from the PAST 7 DAYS.
    - Reference specific recent events: model releases, benchmark results, research papers, company announcements.
    - Name the specific company, model version, or research lab behind the news.
    - Avoid evergreen AI content — readers want THIS WEEK'S frontier insights.

    WRITING RULES:
    - Avoid 2024 buzzwords. Say "agentic" or "reasoning" instead of "generative."
    - Be specific: cite real tools, model names, or company announcements.
    - Start strong — no "In the rapidly evolving world of AI..." intros.
    - Balance vision with practicality.
    
    Format your response as a JSON object:
    {
      "title": "A visionary but specific title about current AI developments (max 10 words)",
      "executiveSummary": {
        "heading": "The New Horizon",
        "content": "The biggest AI development RIGHT NOW. What happened? Why is everyone talking about it? 2-3 crisp, compelling sentences."
      },
      "deepDive": {
        "heading": "The Shift",
        "content": "How does this change work for actuaries, analysts, or tech professionals? Give concrete examples: Autonomous Audits, Real-time Reserving, AI-assisted pricing, Agent-driven research. 5-7 clear sentences building the full picture."
      },
      "marketPulse": {
        "heading": "The Players",
        "content": "Who's leading this shift? Name specific companies, open-source projects, or emerging startups. What's their edge? 2-3 sentences."
      },
      "theVerdict": {
        "heading": "The Bottom Line",
        "content": "The one takeaway readers should remember. What should they do or think differently? 1 powerful sentence."
      }
    }

    Tone: Visionary, grounded, and exciting. A trusted guide to the AI future.
    Return ONLY the JSON object.
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
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        continue;
      }
      throw error;
    }
  }
}

export async function generateActuarialSimplified(retries = 3) {
  const prompt = `
    You are a warm, approachable mentor for "Sutra" — a minimalist blog that makes actuarial concepts simple and memorable.
    
    YOUR MISSION: Simplify an actuarial concept that's been in THE NEWS in the LAST 7 DAYS — make this week's risk topic accessible.

    BRAND VOICE - "SUTRA" PHILOSOPHY:
    - "Sutra" means "thread" — connecting complex ideas to everyday understanding.
    - Warm and illuminating. Complexity is just clarity waiting to happen.
    - "Exploring numbers, AI, and the human side of tech."

    2026 ACTUARIAL CONCEPTS (Pick one that's been in recent news or gained attention this week):
    - Cyber Loss Modeling: Quantifying digital catastrophes and contagion risk.
    - Parametric Insurance: Instant payouts triggered by data (weather, sensors, blockchain), not adjusters.
    - Longevity 2.0: Pricing for 100+ year lifespans and medical breakthroughs.
    - Real-time Underwriting: Dynamic pricing that updates as you live (wearables, telematics, IoT).
    - Climate Risk Integration: TCFD disclosures, stranded asset modeling, physical vs transition risk.
    - AI Governance Risk: Model risk in a world of black-box reasoning agents.
    - Embedded Insurance: Coverage bundled at point of sale (car rentals, e-commerce, subscriptions).

    ⚡ RECENCY IS CRITICAL:
    - Choose a concept that connects to a NEWS STORY or EVENT from the PAST 7 DAYS.
    - Open with a hook referencing the recent event: "After this week's [X happened], you might be wondering..."
    - Make the concept feel timely and relevant, not textbook-abstract.

    WRITING RULES:
    - No math formulas. Focus on the LOGIC and INTUITION of the risk.
    - One concept, explained brilliantly. Better to go deep than wide.
    - Use vivid analogies that stick: "Parametric insurance is like a vending machine for disaster relief..."
    - Write like you're explaining to a smart friend over coffee. Engaged, not lecturing.
    - Start strong — dive right into the explanation, no preamble.
    
    Format your response as a JSON object:
    {
      "title": "A fun, memorable title using an analogy (e.g., 'Why Cyber Insurance Works Like a Digital Immune System')",
      "theJargon": {
        "heading": "The Fancy Term",
        "content": "The formal term and its textbook definition. Keep it brief — just the 'official' version in 1-2 sentences."
      },
      "realTalk": {
        "heading": "In Plain English",
        "content": "Explain the concept using a vivid, relatable 2026 analogy. Make it click. 2-3 sentences that create an 'aha!' moment."
      },
      "whyItMatters": {
        "heading": "The 'So What?'",
        "content": "Why does this matter to the average person, society, or the future? How does it affect their life, wallet, or world? 1-2 practical sentences."
      }
    }

    Tone: Warm, conversational, and illuminating. A mentor who genuinely loves making the complex simple.
    Return ONLY the JSON object.
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
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        continue;
      }
      throw error;
    }
  }
}

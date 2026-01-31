import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from environment variables
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const DEFAULT_MODEL = "gemini-3-flash-preview";
const GEMINI_MODEL = process.env.GEMINI_MODEL || DEFAULT_MODEL;

export async function generateSutraTrivia(retries = 3) {
  const prompt = `
    You are the AI editor for "Sutra", an actuarial and technology blog in 2026.
    Write for EVERYONE - from students to seasoned professionals. 

    2026 CONTEXT:
    - AI has shifted from chat boxes to "Autonomous Agents" that do tasks.
    - "Reasoning Models" (like the successors to o1) are the new standard for logic.
    - Climate-linked parametric insurance and real-time risk detection are peak industry trends.
    
    WRITING RULES:
    - Use plain, everyday language. Avoid jargon.
    - Write short, punchy sentences. One idea per sentence.
    - Make it feel like a friendly conversation, not a textbook.
    - Be specific and concrete. Use 2026-relevant examples.
    
    Format your response as a JSON object with the following structure:
    {
      "title": "A short, catchy title reflecting 2026 tech or risk",
      "breakingThread": {
        "heading": "Breaking Thread",
        "content": "What's the latest in Agentic AI, reasoning models, or insurance tech TODAY (2026)? 2-3 simple sentences. Why is this a game-changer?"
      },
      "sutraFact": {
        "heading": "Sutra Fact",
        "content": "A surprising fact about numbers, risk, or insurance history. Can be a 'did you know' about how AI or climate data changed history."
      },
      "actuarysEdge": {
        "heading": "Actuary's Edge",
        "content": "One quick tip using AI Agents, Python, or Reasoning tools. Example: 'Use an SLM (Small Language Model) for X' or 'Ask your reasoning agent to Y'."
      }
    }

    Tone: Friendly, visionary, and clear. Think 'a smart friend from the future'.
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
    You are the Market Strategist for "Sutra" in 2026.
    Explain economic news so that ANYONE can understand it.
    
    2026 ECONOMIC THEMES:
    - Post-inflation stability and AI-driven productivity booms.
    - Energy transition costs and climate-linked economic volatility.
    - The rise of the "Agentic Economy" where AI agents handle transactions.

    WRITING RULES:
    - No finance jargon. Explain terms like "yield," "equity," or "productivity" if used.
    - Use relatable examples (cost of living, job security, tech-driven savings).
    - Answer "so what?" - how does this affect someone's wallet or work in 2026?
    
    Format your response as a JSON object:
    {
      "title": "A clear, interesting headline about the 2026 economy",
      "macroView": {
        "heading": "The Big Picture",
        "content": "What's the major news in the global economy right now? Focus on 2026 themes like AI efficiency or climate risk. 2 sentences."
      },
      "actuarialAngle": {
        "heading": "What It Means for Insurance",
        "content": "How does this economic shift change insurance premiums or risk pools in 2026? 1-2 plain sentences."
      },
      "riskRadar": {
        "heading": "Something to Watch",
        "content": "One emerging risk most people are ignoring (e.g., AI compute shortages, cyber-physical threats). 1 simple sentence."
      }
    }

    Tone: Clear, helpful, and forward-looking.
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
    You are a friendly coding mentor for "Sutra" in 2026.
    Teach coding tips that focus on "AI-augmented workflows" - using Python, SQL, or AI Agents.
    
    WRITING RULES:
    - Focus on the "Human-in-the-loop" aspect. How does AI help you code better?
    - Keep code snippets SHORT (5-10 lines). Use modern libs (Polars over Pandas, modern SQL).
    - Explain "Small Language Models" (SLMs) and how to run them locally if relevant.
    - Show the efficiency gain: "AI did the heavy lifting, I did the strategy."
    
    Format your response as a JSON object:
    {
      "title": "A title about AI-powered coding in 2026",
      "theChallenge": {
        "heading": "The Grind",
        "content": "What's the boring task AI is fixing? Describe it like you're glad it's automated now. 1-2 sentences."
      },
      "sutraSnippet": {
        "heading": "The AI Workflow",
        "content": "A simple code snippet or a specialized prompt technique. Use markdown code blocks.",
        "language": "python, sql, or prompting"
      },
      "efficiencyGain": {
        "heading": "The Lever",
        "content": "How much more can you do now? Faster by 10x? Zero bugs? 1 sentence."
      }
    }

    Tone: Empowering and tech-savvy. Like a mentor showing you a superpower.
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
    You are a friendly tech visionary for "Sutra" in 2026.
    Explain the latest AI frontiers so that anyone can see the future.
    
    2026 AI FRONTIERS:
    - Reasoning Models (Logic-heavy, system-2 thinking).
    - Multi-modal Agents (AI that sees, hears, and acts).
    - Sovereign AI and Data Privacy (Local execution, personal servers).

    WRITING RULES:
    - Avoid 2024 buzzwords. Instead of "generative," talk about "agentic" or "reasoning-based."
    - Be specific: cite the 2026 versions of tools (e.g., OpenSource SLMs, reasoning chips).
    - Answer "how does this make me more powerful?" 
    
    Format your response as a JSON object:
    {
      "title": "A visionary title about the 2026 AI frontier",
      "executiveSummary": {
        "heading": "The New Horizon",
        "content": "What's the big 2026 AI development? Why is 'logic' or 'agency' the headline? 2-3 sentences."
      },
      "deepDive": {
        "heading": "The Shift",
        "content": "How does this change the actuarial or finance world? Give examples of 'Autonomous Audits' or 'Real-time Reserving'. 5-7 clear sentences."
      },
      "marketPulse": {
        "heading": "The Players",
        "content": "Which 2026 leaders or startups are winning? Mention 'Sovereign AI' or 'Reasoning Infrastructure'. 2 sentences."
      },
      "theVerdict": {
        "heading": "The Bottom Line",
        "content": "What's the one thing to remember? 1 sentence."
      }
    }

    Tone: Visionary, grounded, and exciting.
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
    You are a friendly mentor for "Sutra" who makes actuarial concepts simple and fun.
    Your job is to take ONE modern actuarial or risk concept and explain it so anyone can understand.
    
    2026 CONCEPTS TO CONSIDER:
    - Cyber Loss Modeling (Modeling digital catastrophes).
    - Parametric Insurance (Payouts based on data, not adjusters).
    - Longevity 2.0 (Dealing with extreme human lifespans).
    - Real-time Underwriting (Pricing as you live).

    WRITING RULES:
    - Pick a term that sounds complex but can be explained with a simple analogy.
    - Explain it like you're talking to a smart friend over a game or coffee.
    - Use everyday analogies (gaming, streaming, social media, sports).
    - No math formulas. Focus on the *logic* of the risk.
    
    Format your response as a JSON object:
    {
      "title": "A fun title (e.g., 'Why Cyber Insurance is like a Digital Firewall')",
      "theJargon": {
        "heading": "The Fancy Term",
        "content": "The formal term and its textbook definition. Keep it brief."
       },
       "realTalk": {
         "heading": "In Plain English",
         "content": "Explain the logic using a relatable 2026 analogy. 2-3 sentences."
       },
       "whyItMatters": {
         "heading": "The 'So What?'",
         "content": "Why does this matter to the average person or the future of society? 1-2 practical sentences."
       }
    }

    Tone: Warm, conversational, and illuminating. Like a mentor who loves what they do.
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

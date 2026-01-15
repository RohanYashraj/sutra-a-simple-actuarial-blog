import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from environment variables
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const DEFAULT_MODEL = "gemini-3-flash-preview";
const GEMINI_MODEL = process.env.GEMINI_MODEL || DEFAULT_MODEL;

export async function generateSutraTrivia(retries = 3) {
  const prompt = `
    You are the AI editor for "Sutra", a premier actuarial and technology blog. 
    Your goal is to provide a high-value weekly insight for professional actuaries and tech enthusiasts.
    
    Format your response as a JSON object with the following structure:
    {
      "title": "A short, catchy title for today's insight",
      "breakingThread": {
        "heading": "Breaking Thread",
        "content": "A concise (2-3 sentences) summary of a trending news item in AI, GenAI, or Actuarial Science from the last 24-48 hours. Focus on professional impact."
      },
      "sutraFact": {
        "heading": "Sutra Fact",
        "content": "A fascinating, non-obvious fun fact or trivia about actuarial history, probability, insurance, or mathematical milestones."
      },
      "actuarysEdge": {
        "heading": "Actuary's Edge",
        "content": "A practical, 1-sentence tip or "power move" involving Python, Excel, LLMs, or modern data tools that an actuary can use today."
      }
    }

    Keep the tone: Professional, minimalist, and intellectually stimulating.
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
    You are the Market Strategist for "Sutra". 
    Your goal is to provide a concise brief on global economic trends specifically for actuaries.
    
    Format your response as a JSON object:
    {
      "title": "A sharp title about today's market pulse",
      "macroView": {
        "heading": "The Macro View",
        "content": "A 2-sentence summary of a major global economic event from the last 24 hours (e.g., rate changes, inflation data, geopolitical shifts)."
      },
      "actuarialAngle": {
        "heading": "The Actuarial Angle",
        "content": "Why does this matter for insurance? (e.g., impact on discounting, reserving, or asset-liability matching). 1-2 sentences."
      },
      "riskRadar": {
        "heading": "Risk Radar",
        "content": "One specific emerging risk that isn't yet mainstream. 1 sentence."
      }
    }

    Tone: Analytical, objective, and institutional.
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
    You are the Principal Engineer for "Sutra". 
    Your goal is to provide a technical insight or "Code Sutra" for actuarial modeling.
    
    Format your response as a JSON object:
    {
      "title": "Brief title for today's code challenge",
      "theChallenge": {
        "heading": "The Challenge",
        "content": "Describe a common modeling hurdle (e.g., inefficient loops in Python, complex data joining in R). 1-2 sentences."
      },
      "sutraSnippet": {
        "heading": "The Sutra Snippet",
        "content": "A short, elegant code snippet (Python or R) that solves the challenge. Use markdown code blocks.",
        "language": "python or r"
      },
      "efficiencyGain": {
        "heading": "Efficiency Gain",
        "content": "Explanation of why this snippet is superior. 1 sentence."
      }
    }

    Tone: Technical, precise, and helpful.
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
    You are the Futurist-in-Chief for "Sutra". 
    Your goal is to provide a "long read" insight on GenAI, AI Agents, and latest market trends in the Actuarial domain.
    
    Format your response as a JSON object:
    {
      "title": "A visionary title for today's long-read",
      "executiveSummary": {
        "heading": "The Frontier",
        "content": "A high-level overview of a major shift or breakthrough in GenAI/AI Agents for insurance and finance. 2-3 sentences."
      },
      "deepDive": {
        "heading": "The Deep Dive",
        "content": "A detailed analysis (4-6 sentences) of the technical or strategic implications. Focus on how AI agents are changing the actuarial workflow or business models."
      },
      "marketPulse": {
        "heading": "Market Intelligence",
        "content": "Recent funding, acquisitions, or enterprise adoption of AI in Actuarial. 2 sentences."
      },
      "theVerdict": {
        "heading": "The Sutra Verdict",
        "content": "A bold prediction or a critical takeaway for decision-makers. 1 sentence."
      }
    }

    Tone: Thought-provoking, authoritative, and forward-looking.
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

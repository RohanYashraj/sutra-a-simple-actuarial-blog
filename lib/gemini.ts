import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from environment variables
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const DEFAULT_MODEL = "gemini-3-flash-preview";
const GEMINI_MODEL = process.env.GEMINI_MODEL || DEFAULT_MODEL;

export async function generateSutraTrivia(retries = 3) {
  const prompt = `
    You are the AI editor for "Sutra", an actuarial and technology blog.
    Write for EVERYONE - not just experts. Your readers may be students, curious professionals, or newcomers to the field.
    
    WRITING RULES:
    - Use plain, everyday language. Avoid jargon and technical terms.
    - If you must use a technical term, briefly explain it in parentheses.
    - Write short, punchy sentences. One idea per sentence.
    - Make it feel like a friendly conversation, not a textbook.
    - Be specific and concrete. Use examples people can relate to.
    
    Format your response as a JSON object with the following structure:
    {
      "title": "A short, catchy title that anyone can understand",
      "breakingThread": {
        "heading": "Breaking Thread",
        "content": "What's happening in AI or insurance this week? Explain it like you're telling a friend over coffee. 2-3 simple sentences. Why should anyone care?"
      },
      "sutraFact": {
        "heading": "Sutra Fact",
        "content": "A surprising fun fact about numbers, risk, or insurance history. Make it interesting enough to share at a dinner party!"
      },
      "actuarysEdge": {
        "heading": "Actuary's Edge",
        "content": "One quick tip using Python, Excel, or AI tools. Keep it simple - even a beginner should understand what to do."
      }
    }

    Tone: Friendly, clear, and interesting. Think "smart friend explaining things" not "professor lecturing."
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
    Explain economic news so that ANYONE can understand it - not just finance experts.
    
    WRITING RULES:
    - No finance jargon. If you say "interest rates," explain what that means for real people.
    - Use relatable examples (mortgages, grocery prices, job security).
    - Short sentences. Simple words. Clear connections.
    - Answer "so what?" - why should someone care about this?
    
    Format your response as a JSON object:
    {
      "title": "A clear, interesting title about what's happening in the economy",
      "macroView": {
        "heading": "The Big Picture",
        "content": "What's the major economic news right now? Explain it simply. How might it affect everyday life? 2 sentences."
      },
      "actuarialAngle": {
        "heading": "What It Means for Insurance",
        "content": "How could this affect insurance companies or your insurance costs? 1-2 plain sentences."
      },
      "riskRadar": {
        "heading": "Something to Watch",
        "content": "One emerging risk most people haven't heard about yet. 1 simple sentence."
      }
    }

    Tone: Clear, helpful, and easy to follow. Like a smart friend explaining the news.
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
    You are a friendly coding mentor for "Sutra".
    Teach coding tips that even beginners can understand and apply.
    
    WRITING RULES:
    - Explain the problem first in everyday language. What's frustrating? What takes too long?
    - Keep code snippets SHORT (5-10 lines max). Comment every line.
    - Explain what each line does, like teaching a friend.
    - Use simple variable names that describe what they hold.
    - Show the "before and after" benefit clearly.
    
    Format your response as a JSON object:
    {
      "title": "A friendly title describing today's coding tip",
      "theChallenge": {
        "heading": "The Problem",
        "content": "What's the annoying thing we're fixing? Describe it like you're venting to a coworker. 1-2 sentences."
      },
      "sutraSnippet": {
        "heading": "The Solution",
        "content": "A short, simple code snippet with comments explaining each step. Use markdown code blocks.",
        "language": "python or r"
      },
      "efficiencyGain": {
        "heading": "Why This Rocks",
        "content": "What's better now? Be specific - faster by how much? Fewer lines? Easier to read? 1 sentence."
      }
    }

    Tone: Encouraging, practical, and beginner-friendly. Like a patient mentor, not a textbook.
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
    You are a friendly tech writer for "Sutra".
    Explain AI trends so that non-technical people can understand and get excited about them.
    
    WRITING RULES:
    - Avoid buzzwords. Instead of "leverage AI capabilities," say "use AI to..."
    - Use analogies from everyday life to explain complex concepts.
    - Be specific: name real companies, real tools, real use cases.
    - Answer "why should I care?" for each point you make.
    - Keep sentences short. Break complex ideas into simple steps.
    
    Format your response as a JSON object:
    {
      "title": "An intriguing title that makes someone want to read more",
      "executiveSummary": {
        "heading": "What's Happening",
        "content": "What's the big AI development? What can it do that wasn't possible before? Explain it simply. 2-3 sentences."
      },
      "deepDive": {
        "heading": "Why It Matters",
        "content": "How could this change the way insurance and finance work? Give concrete examples. What jobs or tasks might change? 4-6 clear sentences."
      },
      "marketPulse": {
        "heading": "Who's Doing It",
        "content": "Name specific companies investing in or using this technology. Real examples, real numbers if possible. 2 sentences."
      },
      "theVerdict": {
        "heading": "The Bottom Line",
        "content": "What's the one thing readers should remember from this? Make it memorable. 1 sentence."
      }
    }

    Tone: Curious, clear, and accessible. Like explaining exciting tech to a friend who's smart but not in tech.
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
    You are a friendly teacher for "Sutra" who makes actuarial concepts simple and fun.
    Your job is to take ONE actuarial term or concept and explain it so anyone can understand.
    
    WRITING RULES:
    - Pick a real actuarial term that professionals use every day
    - Explain it like you're talking to a smart 15-year-old
    - Use everyday analogies (shopping, sports, cooking, etc.)
    - No math formulas unless absolutely necessary
    - Make it memorable and even a bit fun
    
    Format your response as a JSON object:
    {
      "title": "The term or concept being explained (e.g., 'What is a Mortality Table?')",
      "theJargon": {
        "heading": "The Fancy Term",
        "content": "The formal actuarial term and a one-line technical definition. Keep it short - this is what the textbook would say."
      },
      "realTalk": {
        "heading": "In Plain English",
        "content": "Explain this concept using a simple analogy from everyday life. Make it click! 2-3 sentences. Use examples like grocery shopping, weather forecasts, or video games."
      },
      "whyItMatters": {
        "heading": "Why Should You Care?",
        "content": "How does this affect regular people? Insurance costs, retirement planning, etc. 1-2 practical sentences."
      }
    }

    Tone: Warm, approachable, and even a little playful. Like a cool teacher who actually makes things interesting.
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

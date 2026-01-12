import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from environment variables
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export async function generateDailyTrivia(retries = 3) {
  const prompt = `
    You are the AI editor for "Sutra", a premier actuarial and technology blog. 
    Your goal is to provide a high-value daily insight for professional actuaries and tech enthusiasts.
    
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
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const text = response.text;
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

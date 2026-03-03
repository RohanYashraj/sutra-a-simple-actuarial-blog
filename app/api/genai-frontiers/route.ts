import { generateGenAIFrontiers } from "@/lib/gemini";
import { NextResponse, connection } from "next/server";
import { getEmailTemplate } from "@/lib/email";
import { sendStreamBroadcast } from "@/lib/broadcasts";

export async function triggerGenAIFrontiersBroadcast() {
  try {
    // 1. Generate content using Gemini
    const frontiers = await generateGenAIFrontiers();

    // 2. Format HTML
    const emailHtml = getEmailTemplate(
      frontiers.title,
      `
      <h1>${frontiers.title}</h1>
      <p style="font-size: 13px; color: #9ca3af; margin-bottom: 36px; letter-spacing: 0.04em;">GenAI Frontiers &middot; ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

      <div style="margin-bottom: 28px; padding: 24px 28px; background-color: #1f2937; border-radius: 12px;">
        <h2 style="color: #9ca3af;">${frontiers.executiveSummary.heading}</h2>
        <p style="font-size: 16px; line-height: 1.7; margin-bottom: 0; color: #e5e7eb;">${frontiers.executiveSummary.content}</p>
      </div>

      <div style="margin-bottom: 28px; padding: 0 4px;">
        <h2>${frontiers.deepDive.heading}</h2>
        <p style="font-size: 15px; line-height: 1.8; color: #374151;">${frontiers.deepDive.content}</p>
      </div>

      <div style="margin-bottom: 28px; padding: 24px 28px; background-color: #fafaf8; border-radius: 12px; border: 1px solid #f0eeeb;">
        <h2>${frontiers.marketPulse.heading}</h2>
        <p style="color: #374151; margin-bottom: 0;">${frontiers.marketPulse.content}</p>
      </div>

      <div style="margin-bottom: 28px; text-align: center; padding: 28px 0; border-top: 1px solid #f0eeeb; border-bottom: 1px solid #f0eeeb;">
        <h2>${frontiers.theVerdict.heading}</h2>
        <p style="font-size: 17px; font-weight: 500; color: #1f2937; margin-bottom: 0; font-style: italic;">${frontiers.theVerdict.content}</p>
      </div>

      <div style="text-align: center; margin-top: 44px;">
        <a href="https://sutra.rohanyashraj.com" class="btn">Explore the Frontier</a>
      </div>
      `,
    );

    // 3. Send broadcast and archive
    const { broadcastId, title } = await sendStreamBroadcast({
      type: "genai-frontiers",
      title: frontiers.title,
      subject: frontiers.title,
      from: "Sutra | GenAI Frontiers <newsletter@sutra.rohanyashraj.com>",
      replyTo: "rohanyashraj@gmail.com",
      html: emailHtml,
      data: frontiers,
    });

    return { broadcastId, title };
  } catch (error: any) {
    console.error("GenAI Frontiers API Error:", error);
    throw error;
  }
}

export async function GET() {
  await connection();
  try {
    const result = await triggerGenAIFrontiersBroadcast();
    return NextResponse.json({
      success: true,
      message: "GenAI Frontiers broadcast sent successfully",
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

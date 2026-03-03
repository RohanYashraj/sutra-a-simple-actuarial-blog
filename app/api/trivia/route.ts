import { generateSutraTrivia } from "@/lib/gemini";
import { NextResponse, connection } from "next/server";
import { getEmailTemplate } from "@/lib/email";
import { sendStreamBroadcast } from "@/lib/broadcasts";

export async function triggerTriviaBroadcast() {
  try {
    // 1. Generate content using Gemini
    const trivia = await generateSutraTrivia();

    // 2. Format HTML
    const emailHtml = getEmailTemplate(
      trivia.title,
      `
      <h1>${trivia.title}</h1>
      <p style="font-size: 13px; color: #9ca3af; margin-bottom: 36px; letter-spacing: 0.04em;">The Sutra Insight &middot; ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

      <div style="margin-bottom: 28px; padding: 24px 28px; background-color: #fafaf8; border-radius: 12px; border: 1px solid #f0eeeb;">
        <h2>${trivia.breakingThread.heading}</h2>
        <p style="margin-bottom: 0; color: #374151;">${trivia.breakingThread.content}</p>
      </div>

      <div style="margin-bottom: 28px; padding: 0 4px;">
        <h2>${trivia.sutraFact.heading}</h2>
        <p style="color: #374151;">${trivia.sutraFact.content}</p>
      </div>

      <div style="margin-bottom: 28px; border-left: 3px solid #d1d5db; padding-left: 24px;">
        <h2>${trivia.actuarysEdge.heading}</h2>
        <p style="margin-bottom: 0; color: #4b5563; font-style: italic;">${trivia.actuarysEdge.content}</p>
      </div>

      <div style="text-align: center; margin-top: 44px;">
        <a href="https://sutra.rohanyashraj.com" class="btn">Read More on Sutra</a>
      </div>
      `,
    );

    // 3. Send broadcast and archive
    const { broadcastId, title } = await sendStreamBroadcast({
      type: "trivia",
      title: trivia.title,
      subject: trivia.title,
      from: "Sutra | Trivia <newsletter@sutra.rohanyashraj.com>",
      replyTo: "rohanyashraj@gmail.com",
      html: emailHtml,
      data: trivia,
    });

    return { broadcastId, title };
  } catch (error: any) {
    console.error("Trivia API Error:", error);
    throw error;
  }
}

export async function GET() {
  await connection();
  try {
    const result = await triggerTriviaBroadcast();
    return NextResponse.json({
      success: true,
      message: "Sutra trivia broadcast sent successfully",
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

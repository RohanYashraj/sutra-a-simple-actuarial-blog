import { generateActuarialSimplified } from "@/lib/gemini";
import { NextResponse, connection } from "next/server";
import { getEmailTemplate } from "@/lib/email";
import { sendStreamBroadcast } from "@/lib/broadcasts";

export async function triggerActuarialSimplifiedBroadcast() {
  try {
    // 1. Generate content using Gemini
    const simplified = await generateActuarialSimplified();

    // 2. Format HTML
    const emailHtml = getEmailTemplate(
      simplified.title,
      `
      <h1>${simplified.title}</h1>
      <p style="font-size: 13px; color: #9ca3af; margin-bottom: 36px; letter-spacing: 0.04em;">Actuarial Simplified &middot; ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

      <div style="margin-bottom: 28px; padding: 24px 28px; background-color: #fafaf8; border-radius: 12px; border-left: 3px solid #d1d5db;">
        <h2>${simplified.theJargon.heading}</h2>
        <p style="font-size: 16px; line-height: 1.7; margin-bottom: 0; color: #374151; font-style: italic;">${simplified.theJargon.content}</p>
      </div>

      <div style="margin-bottom: 28px; padding: 24px 28px; background-color: #1f2937; border-radius: 12px;">
        <h2 style="color: #9ca3af;">${simplified.realTalk.heading}</h2>
        <p style="font-size: 16px; line-height: 1.8; margin-bottom: 0; color: #e5e7eb;">${simplified.realTalk.content}</p>
      </div>

      <div style="margin-bottom: 28px; text-align: center; padding: 28px 0; border-top: 1px solid #f0eeeb; border-bottom: 1px solid #f0eeeb;">
        <h2>${simplified.whyItMatters.heading}</h2>
        <p style="font-size: 16px; color: #374151; margin-bottom: 0;">${simplified.whyItMatters.content}</p>
      </div>

      <div style="text-align: center; margin-top: 44px;">
        <a href="https://sutra.rohanyashraj.com" class="btn">Learn More on Sutra</a>
      </div>
      `,
    );

    // 3. Send broadcast and archive
    const { broadcastId, title } = await sendStreamBroadcast({
      type: "actuarial-simplified",
      title: simplified.title,
      subject: simplified.title,
      from: "Sutra | Actuarial Simplified <newsletter@sutra.rohanyashraj.com>",
      replyTo: "rohanyashraj@gmail.com",
      html: emailHtml,
      data: simplified,
    });

    return { broadcastId, title };
  } catch (error: any) {
    console.error("Actuarial Simplified API Error:", error);
    throw error;
  }
}

export async function GET() {
  await connection();
  try {
    const result = await triggerActuarialSimplifiedBroadcast();
    return NextResponse.json({
      success: true,
      message: "Actuarial Simplified broadcast sent successfully",
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

import { generateMarketPulse } from "@/lib/gemini";
import { NextResponse, connection } from "next/server";
import { getEmailTemplate } from "@/lib/email";
import { sendStreamBroadcast } from "@/lib/broadcasts";

export async function triggerMarketPulseBroadcast() {
  try {
    // 1. Generate content using Gemini
    const pulse = await generateMarketPulse();

    // 2. Format HTML
    const emailHtml = getEmailTemplate(
      pulse.title,
      `
      <h1>${pulse.title}</h1>
      <p style="font-size: 13px; color: #9ca3af; margin-bottom: 36px; letter-spacing: 0.04em;">Market Pulse &middot; ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

      <div style="margin-bottom: 28px; padding: 24px 28px; background-color: #fafaf8; border-radius: 12px; border: 1px solid #f0eeeb;">
        <h2>${pulse.macroView.heading}</h2>
        <p style="margin-bottom: 0; color: #374151;">${pulse.macroView.content}</p>
      </div>

      <div style="margin-bottom: 28px; padding: 0 4px;">
        <h2>${pulse.actuarialAngle.heading}</h2>
        <p style="color: #374151;">${pulse.actuarialAngle.content}</p>
      </div>

      <div style="margin-bottom: 28px; border-left: 3px solid #d1d5db; padding-left: 24px;">
        <h2>${pulse.riskRadar.heading}</h2>
        <p style="margin-bottom: 0; color: #4b5563; font-style: italic;">${pulse.riskRadar.content}</p>
      </div>

      <div style="text-align: center; margin-top: 44px;">
        <a href="https://sutra.rohanyashraj.com" class="btn">Explore More on Sutra</a>
      </div>
      `,
    );

    // 3. Send broadcast and archive
    const { broadcastId, title } = await sendStreamBroadcast({
      type: "market-pulse",
      title: pulse.title,
      subject: pulse.title,
      from: "Sutra | Market Pulse <newsletter@sutra.rohanyashraj.com>",
      replyTo: "rohanyashraj@gmail.com",
      html: emailHtml,
      data: pulse,
    });

    return { broadcastId, title };
  } catch (error: any) {
    console.error("Market Pulse API Error:", error);
    throw error;
  }
}

export async function GET() {
  await connection();
  try {
    const result = await triggerMarketPulseBroadcast();
    return NextResponse.json({
      success: true,
      message: "Market Pulse broadcast sent successfully",
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

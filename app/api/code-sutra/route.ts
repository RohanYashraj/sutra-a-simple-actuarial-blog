import { generateCodeSutra } from "@/lib/gemini";
import { NextResponse, connection } from "next/server";
import { getEmailTemplate } from "@/lib/email";
import { sendStreamBroadcast } from "@/lib/broadcasts";

export async function triggerCodeSutraBroadcast() {
  try {
    // 1. Generate content using Gemini
    const codeSutra = await generateCodeSutra();

    // 2. Format HTML
    const emailHtml = getEmailTemplate(
      codeSutra.title,
      `
      <h1>${codeSutra.title}</h1>
      <p style="font-size: 13px; color: #9ca3af; margin-bottom: 36px; letter-spacing: 0.04em;">Code Sutra &middot; ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

      <div style="margin-bottom: 28px; padding: 0 4px;">
        <h2>${codeSutra.theChallenge.heading}</h2>
        <p style="color: #374151;">${codeSutra.theChallenge.content}</p>
      </div>

      <div style="margin-bottom: 28px; padding: 24px 28px; background-color: #1f2937; border-radius: 12px; font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', Courier, monospace; overflow-x: auto;">
        <p style="margin-top: 0; margin-bottom: 12px; font-family: 'Outfit', 'Segoe UI', sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af;">${codeSutra.sutraSnippet.heading} &middot; ${codeSutra.sutraSnippet.language}</p>
        <pre style="margin: 0; color: #e5e7eb; font-size: 13px; line-height: 1.6; white-space: pre-wrap; word-break: break-all;">${codeSutra.sutraSnippet.content.replace(/```[a-z]*\n|```/g, "")}</pre>
      </div>

      <div style="margin-bottom: 28px; border-left: 3px solid #d1d5db; padding-left: 24px;">
        <h2>${codeSutra.efficiencyGain.heading}</h2>
        <p style="margin-bottom: 0; color: #4b5563; font-style: italic;">${codeSutra.efficiencyGain.content}</p>
      </div>

      <div style="text-align: center; margin-top: 44px;">
        <a href="https://sutra.rohanyashraj.com" class="btn">More on Sutra</a>
      </div>
      `,
    );

    // 3. Send broadcast and archive
    const { broadcastId, title } = await sendStreamBroadcast({
      type: "code-sutra",
      title: codeSutra.title,
      subject: codeSutra.title,
      from: "Sutra | Code Sutra <newsletter@sutra.rohanyashraj.com>",
      replyTo: "rohanyashraj@gmail.com",
      html: emailHtml,
      data: codeSutra,
    });

    return { broadcastId, title };
  } catch (error: any) {
    console.error("Code Sutra API Error:", error);
    throw error;
  }
}

export async function GET() {
  await connection();
  try {
    const result = await triggerCodeSutraBroadcast();
    return NextResponse.json({
      success: true,
      message: "Code Sutra broadcast sent successfully",
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

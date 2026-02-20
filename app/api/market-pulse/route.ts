import { generateMarketPulse } from "@/lib/gemini";
import { Resend } from "resend";
import { NextResponse, connection } from "next/server";
import { getEmailTemplate } from "@/lib/email";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { sanitizeSlug } from "@/lib/slug";
import { submitUrlsToIndexNow } from "@/lib/indexnow";

const resend = new Resend(process.env.RESEND_API_KEY);
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function triggerMarketPulseBroadcast() {
  try {
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!audienceId) {
      throw new Error("RESEND_AUDIENCE_ID is not set");
    }

    // 1. Generate content using Gemini
    const pulse = await generateMarketPulse();

    // 2. Format HTML
    const emailHtml = getEmailTemplate(
      pulse.title,
      `
      <h1>${pulse.title}</h1>
      <p style="font-size: 14px; color: #71717a; margin-bottom: 32px;">Sutra Market Pulse • ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

      <div style="margin-bottom: 32px; padding: 24px; background-color: #fafafa; border-radius: 8px; border: 1px solid #f4f4f5;">
        <h2 style="margin-top: 0; font-size: 18px; color: #000000;">${pulse.macroView.heading}</h2>
        <p style="margin-bottom: 0; color: #000000;">${pulse.macroView.content}</p>
      </div>

      <div style="margin-bottom: 32px;">
        <h2 style="font-size: 18px; color: #000000;">${pulse.actuarialAngle.heading}</h2>
        <p style="color: #000000;">${pulse.actuarialAngle.content}</p>
      </div>

      <div style="margin-bottom: 32px; border-left: 2px solid #000000; padding-left: 20px;">
        <h2 style="font-size: 18px; color: #000000; margin-top: 0;">${pulse.riskRadar.heading}</h2>
        <p style="margin-bottom: 0; color: #3f3f46; font-style: italic;">${pulse.riskRadar.content}</p>
      </div>

      <div style="text-align: center; margin-top: 40px;">
        <a href="https://sutra.rohanyashraj.com" class="btn">Analyze More on Sutra</a>
      </div>
      `,
    );

    // 3. Create Resend Broadcast
    const { data, error } = await resend.broadcasts.create({
      audienceId,
      from: "Sutra | Market Pulse <newsletter@sutra.rohanyashraj.com>",
      subject: `${pulse.title}`,
      replyTo: "rohanyashraj@gmail.com",
      html: emailHtml,
      name: `Market Pulse - ${new Date().toLocaleDateString()}`,
    });

    if (error || !data) {
      throw new Error(
        `Resend Broadcast Error: ${error?.message || "Unknown error"}`,
      );
    }

    // 4. Send immediately
    const { error: sendError } = await resend.broadcasts.send(data.id);

    if (sendError) {
      throw new Error(`Resend Send Error: ${sendError.message}`);
    }

    // 5. Archive to Convex
    const slug = `${sanitizeSlug(pulse.title)}-${new Date().getTime()}`;
    await convex.mutation(api.broadcasts.saveBroadcast, {
      type: "market-pulse",
      title: pulse.title,
      slug,
      data: pulse,
    });

    // 6. Submit to IndexNow
    await submitUrlsToIndexNow([
      `https://sutra.rohanyashraj.com/archive/market-pulse/${slug}`,
    ]);

    return {
      broadcastId: data.id,
      title: pulse.title,
    };
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

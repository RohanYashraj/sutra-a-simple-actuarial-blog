import { generateGenAIFrontiers } from "@/lib/gemini";
import { Resend } from "resend";
import { NextResponse, connection } from "next/server";
import { getEmailTemplate } from "@/lib/email";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const resend = new Resend(process.env.RESEND_API_KEY);


export async function triggerGenAIFrontiersBroadcast() {
  try {
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!audienceId) {
      throw new Error("RESEND_AUDIENCE_ID is not set");
    }

    // 1. Generate content using Gemini
    const frontiers = await generateGenAIFrontiers();

    // 2. Format HTML
    const emailHtml = getEmailTemplate(
      frontiers.title,
      `
      <h1 style="font-size: 36px; line-height: 1.1; margin-bottom: 8px;">${frontiers.title}</h1>
      <p style="font-size: 14px; color: #71717a; margin-bottom: 32px; letter-spacing: 0.05em; text-transform: uppercase;">Actuarial Intelligence • ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <div style="margin-bottom: 40px; padding: 32px; background-color: #000000; color: #ffffff; border-radius: 4px;">
        <h2 style="margin-top: 0; font-size: 20px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.1em;">${frontiers.executiveSummary.heading}</h2>
        <p style="font-size: 18px; line-height: 1.6; margin-bottom: 0; color: #ffffff;">${frontiers.executiveSummary.content}</p>
      </div>

      <div style="margin-bottom: 40px;">
        <h2 style="font-size: 24px; color: #000000; border-bottom: 2px solid #000000; padding-bottom: 8px; display: inline-block;">${frontiers.deepDive.heading}</h2>
        <p style="font-size: 17px; line-height: 1.8; color: #000000; margin-top: 24px;">${frontiers.deepDive.content}</p>
      </div>

      <div style="margin-bottom: 40px; padding: 24px; background-color: #fafafa; border-radius: 8px; border: 1px solid #f4f4f5;">
        <h2 style="font-size: 18px; color: #000000; margin-top: 0;">${frontiers.marketPulse.heading}</h2>
        <p style="color: #3f3f46; margin-bottom: 0;">${frontiers.marketPulse.content}</p>
      </div>

      <div style="margin-bottom: 40px; text-align: center; border-top: 1px solid #f4f4f5; border-bottom: 1px solid #f4f4f5; padding: 32px 0;">
        <h2 style="font-size: 16px; color: #71717a; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 0;">${frontiers.theVerdict.heading}</h2>
        <p style="font-size: 20px; font-weight: 600; color: #000000; margin-bottom: 0; font-style: italic;">"${frontiers.theVerdict.content}"</p>
      </div>

      <div style="text-align: center; margin-top: 40px;">
        <a href="https://sutra.rohanyashraj.com" class="btn">Explore the Frontier</a>
      </div>
            `
    );

    // 2.5 Archive to Convex
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const slug = frontiers.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

    await convex.mutation(api.broadcasts.saveBroadcast, {
      type: 'genai-frontiers',
      title: frontiers.title,
      slug: `${new Date().toISOString().split('T')[0]}-${slug}`,
      data: frontiers,
    });

    // 3. Create Resend Broadcast
    const { data, error } = await resend.broadcasts.create({
      audienceId,
      from: "Sutra GenAI Frontiers <newsletter@sutra.rohanyashraj.com>",
      subject: `Frontiers: ${frontiers.title}`,
      replyTo: "rohanyashraj@gmail.com",
      html: emailHtml,
      name: `GenAI Frontiers - ${new Date().toLocaleDateString()}`,
    });

    if (error || !data) {
      throw new Error(`Resend Broadcast Error: ${error?.message || 'Unknown error'}`);
    }

    // 4. Send immediately
    const { error: sendError } = await resend.broadcasts.send(data.id);

    if (sendError) {
      throw new Error(`Resend Send Error: ${sendError.message}`);
    }

    return {
      broadcastId: data.id,
      title: frontiers.title
    };
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
      ...result
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

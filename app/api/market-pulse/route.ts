import { generateMarketPulse } from "@/lib/gemini";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { getEmailTemplate } from "@/lib/email";

const resend = new Resend(process.env.RESEND_API_KEY);

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const audienceId = process.env.RESEND_AUDIENCE_ID;

        if (!audienceId) {
            return NextResponse.json({ error: "RESEND_AUDIENCE_ID is not set" }, { status: 500 });
        }

        // 1. Generate content using Gemini
        const pulse = await generateMarketPulse();

        // 2. Format HTML
        const emailHtml = getEmailTemplate(
            pulse.title,
            `
      <h1>${pulse.title}</h1>
      <p style="font-size: 14px; color: #71717a; margin-bottom: 32px;">Sutra Market Pulse • ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <div style="margin-bottom: 32px; padding: 24px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
        <h2 style="margin-top: 0; font-size: 18px; color: #0f172a;">${pulse.macroView.heading}</h2>
        <p style="margin-bottom: 0; color: #334155;">${pulse.macroView.content}</p>
      </div>

      <div style="margin-bottom: 32px;">
        <h2 style="font-size: 18px; color: #0f172a;">${pulse.actuarialAngle.heading}</h2>
        <p style="color: #334155;">${pulse.actuarialAngle.content}</p>
      </div>

      <div style="margin-bottom: 32px; border-left: 2px solid #3b82f6; padding-left: 20px; background-color: #eff6ff; padding-top: 16px; padding-bottom: 16px; padding-right: 16px; border-radius: 0 8px 8px 0;">
        <h2 style="font-size: 18px; color: #1e40af; margin-top: 0;">${pulse.riskRadar.heading}</h2>
        <p style="margin-bottom: 0; color: #1e3a8a;">${pulse.riskRadar.content}</p>
      </div>

      <div style="text-align: center; margin-top: 40px;">
        <a href="https://sutra.rohanyashraj.com" class="btn">Analyze More on Sutra</a>
      </div>
      `
        );

        // 3. Create Resend Broadcast
        const { data, error } = await resend.broadcasts.create({
            audienceId,
            from: "Sutra Market Pulse <newsletter@sutra.rohanyashraj.com>",
            subject: `Market Pulse: ${pulse.title}`,
            replyTo: "rohanyashraj@gmail.com",
            html: emailHtml,
            name: `Market Pulse - ${new Date().toLocaleDateString()}`,
        });

        if (error || !data) {
            console.error("Resend Broadcast Error:", error);
            return NextResponse.json({ error: "Failed to create market pulse broadcast" }, { status: 500 });
        }

        // 4. Send immediately
        const { error: sendError } = await resend.broadcasts.send(data.id);

        if (sendError) {
            console.error("Resend Send Error:", sendError);
            return NextResponse.json({ error: "Failed to trigger market pulse broadcast" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Market Pulse broadcast sent successfully",
            broadcastId: data.id,
            title: pulse.title
        });

    } catch (error) {
        console.error("Market Pulse API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

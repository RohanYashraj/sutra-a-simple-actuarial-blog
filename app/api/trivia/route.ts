import { generateDailyTrivia } from "@/lib/gemini";
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
        const trivia = await generateDailyTrivia();

        // 2. Format HTML
        const emailHtml = getEmailTemplate(
            trivia.title,
            `
      <h1>${trivia.title}</h1>
      <p style="font-size: 14px; color: #71717a; margin-bottom: 32px;">The Sutra Insight • ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <div style="margin-bottom: 32px; padding: 24px; background-color: #fafafa; border-radius: 8px; border: 1px solid #f4f4f5;">
        <h2 style="margin-top: 0; font-size: 18px; color: #000000;">${trivia.breakingThread.heading}</h2>
        <p style="margin-bottom: 0;">${trivia.breakingThread.content}</p>
      </div>

      <div style="margin-bottom: 32px;">
        <h2 style="font-size: 18px; color: #000000;">${trivia.sutraFact.heading}</h2>
        <p>${trivia.sutraFact.content}</p>
      </div>

      <div style="margin-bottom: 32px; border-left: 2px solid #000000; padding-left: 20px;">
        <h2 style="font-size: 18px; color: #000000;">${trivia.actuarysEdge.heading}</h2>
        <p style="font-style: italic; color: #3f3f46;">${trivia.actuarysEdge.content}</p>
      </div>

      <div style="text-align: center; margin-top: 40px;">
        <a href="https://sutra.rohanyashraj.com" class="btn">Read More on Sutra</a>
      </div>
      `
        );

        // 3. Create Resend Broadcast
        const { data, error } = await resend.broadcasts.create({
            audienceId,
            from: "Sutra Blog <newsletter@sutra.rohanyashraj.com>",
            subject: `Sutra Insight: ${trivia.title}`,
            replyTo: "rohanyashraj@gmail.com",
            html: emailHtml,
            name: `Daily Trivia - ${new Date().toLocaleDateString()}`,
        });

        if (error || !data) {
            console.error("Resend Broadcast Error:", error);
            return NextResponse.json({ error: "Failed to create trivia broadcast" }, { status: 500 });
        }

        // 4. Send immediately
        const { error: sendError } = await resend.broadcasts.send(data.id);

        if (sendError) {
            console.error("Resend Send Error:", sendError);
            return NextResponse.json({ error: "Failed to trigger trivia broadcast" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Daily trivia broadcast sent successfully",
            broadcastId: data.id,
            title: trivia.title
        });

    } catch (error) {
        console.error("Trivia API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

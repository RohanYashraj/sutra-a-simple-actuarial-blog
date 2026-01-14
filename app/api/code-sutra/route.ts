import { generateCodeSutra } from "@/lib/gemini";
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
        const codeSutra = await generateCodeSutra();

        // 2. Format HTML
        const emailHtml = getEmailTemplate(
            codeSutra.title,
            `
      <h1>${codeSutra.title}</h1>
      <p style="font-size: 14px; color: #71717a; margin-bottom: 32px;">Code Sutra • ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <div style="margin-bottom: 32px;">
        <h2 style="font-size: 18px; color: #000000;">${codeSutra.theChallenge.heading}</h2>
        <p style="color: #3f3f46;">${codeSutra.theChallenge.content}</p>
      </div>

      <div style="margin-bottom: 32px; padding: 24px; background-color: #1e1e1e; border-radius: 8px; font-family: 'Courier New', Courier, monospace; overflow-x: auto;">
        <h2 style="margin-top: 0; font-size: 16px; color: #808080; border-bottom: 1px solid #333; padding-bottom: 8px;">${codeSutra.sutraSnippet.heading} (${codeSutra.sutraSnippet.language})</h2>
        <pre style="margin-top: 16px; color: #d4d4d4; font-size: 13px; line-height: 1.5; white-space: pre-wrap; word-break: break-all;">${codeSutra.sutraSnippet.content.replace(/```[a-z]*\n|```/g, '')}</pre>
      </div>

      <div style="margin-bottom: 32px; padding: 16px; border: 1px dashed #d4d4d8; border-radius: 8px;">
        <h2 style="font-size: 18px; color: #000000; margin-top: 0;">${codeSutra.efficiencyGain.heading}</h2>
        <p style="margin-bottom: 0; color: #52525b; font-style: italic;">${codeSutra.efficiencyGain.content}</p>
      </div>

      <div style="text-align: center; margin-top: 40px;">
        <a href="https://sutra.rohanyashraj.com" class="btn">View More Snippets</a>
      </div>
      `
        );

        // 3. Create Resend Broadcast
        const { data, error } = await resend.broadcasts.create({
            audienceId,
            from: "Code Sutra <newsletter@sutra.rohanyashraj.com>",
            subject: `Code Sutra: ${codeSutra.title}`,
            replyTo: "rohanyashraj@gmail.com",
            html: emailHtml,
            name: `Code Sutra - ${new Date().toLocaleDateString()}`,
        });

        if (error || !data) {
            console.error("Resend Broadcast Error:", error);
            return NextResponse.json({ error: "Failed to create code sutra broadcast" }, { status: 500 });
        }

        // 4. Send immediately
        const { error: sendError } = await resend.broadcasts.send(data.id);

        if (sendError) {
            console.error("Resend Send Error:", sendError);
            return NextResponse.json({ error: "Failed to trigger code sutra broadcast" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Code Sutra broadcast sent successfully",
            broadcastId: data.id,
            title: codeSutra.title
        });

    } catch (error) {
        console.error("Code Sutra API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

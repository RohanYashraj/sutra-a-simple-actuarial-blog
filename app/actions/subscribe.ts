"use server";

import { Resend } from "resend";
import { getEmailTemplate } from "@/lib/email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function subscribeAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  try {
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!audienceId) {
      // Manual fallback or developer notification
      await resend.emails.send({
        from: 'Sutra Blog <newsletter@sutra.rohanyashraj.com>',
        to: 'rohanyashraj@gmail.com',
        subject: 'New Subscriber (No Audience ID)!',
        html: `<p>New subscriber: <strong>${email}</strong>. Please check your RESEND_AUDIENCE_ID.</p>`
      });
      return { success: true, message: "Subscribed (with fallback notifications)" };
    }

    // 1. Add to audience
    await resend.contacts.create({
      email: email,
      firstName: "",
      lastName: "",
      unsubscribed: false,
      audienceId: audienceId,
    });

    // 2. Send Welcome Email
    const welcomeHtml = getEmailTemplate(
      "Welcome to Sutra",
      `
      <h1 style="margin-top: 0;">Welcome & Namaste</h1>
      <p>Thank you for subscribing to <strong>Sutra</strong>. In Sanskrit, a <em>Sutra</em> is a thread—a concise rule or aphorism that connects complex ideas into a cohesive whole.</p>
      
      <p>This is my attempt to find that thread within our profession. We are standing at a unique intersection where traditional actuarial rigor meets the exponential leap of Artificial Intelligence.</p>

      <div style="background-color: #fafafa; padding: 32px; border-radius: 8px; border: 1px solid #f4f4f5; margin: 32px 0;">
        <h2 style="margin-top: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 0.1em; color: #71717a;">Our Weekly Rhythm</h2>
        <ul style="margin-bottom: 0; padding-left: 0; list-style-type: none;">
            <li style="margin-bottom: 16px;">
              <strong style="color: #000000; display: block; font-size: 16px;">Tuesday: GenAI Frontiers</strong>
              <span style="color: #52525b; font-size: 14px;">A visionary deep dive into AI Agents and the future of actuarial work.</span>
            </li>
            <li style="margin-bottom: 16px;">
              <strong style="color: #000000; display: block; font-size: 16px;">Thursday: Market Pulse</strong>
              <span style="color: #52525b; font-size: 14px;">High-impact macroeconomic trends specifically for the actuarial sector.</span>
            </li>
            <li style="margin-bottom: 0;">
              <strong style="color: #000000; display: block; font-size: 16px;">Sunday: Weekend Technical</strong>
              <span style="color: #52525b; font-size: 14px;">A concentrated drop of Sutra Trivia and Code Sutra modeling snippets.</span>
            </li>
        </ul>
      </div>
      
      <p>I'm honored to have you part of this journey. The first step is to explore what we've already built.</p>
      
      <div style="margin-top: 32px; text-align: center;">
        <a href="https://sutra.rohanyashraj.com" class="btn" style="margin-right: 12px; margin-bottom: 12px;">Read the Blog</a>
        <a href="https://sutra.rohanyashraj.com/archive" class="btn" style="background-color: transparent; border: 1px solid #000000; color: #000000 !important; margin-bottom: 12px;">Explore Archives</a>
      </div>

      <p style="margin-top: 40px; border-top: 1px solid #f4f4f5; pt: 24px;">With Regards,<br/><strong>Rohan Yashraj Gupta</strong></p>
    `,
      email
    );

    await resend.emails.send({
      from: "Sutra Blog <newsletter@sutra.rohanyashraj.com>",
      to: email,
      bcc: "sutrarohanyashraj@gmail.com",
      subject: "Welcome to Sutra - A Simple Actuarial Blog",
      html: welcomeHtml,
    });

    return { success: true, message: "Welcome to Sutra!" };
  } catch (error: any) {
    console.error("Subscription Action Error:", error);
    return { error: "Failed to subscribe. Please try again later." };
  }
}

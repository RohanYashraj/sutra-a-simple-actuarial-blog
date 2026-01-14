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
      <h1>Welcome & Namaste</h1>
      <p>Thank you for subscribing to <strong>Sutra</strong>. In Sanskrit, a <em>Sutra</em> is a thread—a concise rule or aphorism that connects complex ideas into a cohesive whole.</p>
      
      <p>This blog is my attempt to find that thread within our profession. We are standing at a unique intersection where traditional actuarial rigor meets the exponential leap of Artificial Intelligence.</p>

      <h2>What to Expect</h2>
      <ul style="margin-bottom: 24px;">
          <li><strong>Daily Trivia:</strong> A bite-sized daily dose of AI news and actuarial fun facts.</li>
          <li><strong>Weekly Digest:</strong> A curated summary of the latest investigative articles.</li>
          <li><strong>Deep Dives:</strong> Technical explorations into modeling and automation.</li>
      </ul>
      
      <p>I'm glad to have you with us.</p>
      <br/>
      <p>With Regards,<br/><strong>Rohan Yashraj Gupta</strong></p>
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

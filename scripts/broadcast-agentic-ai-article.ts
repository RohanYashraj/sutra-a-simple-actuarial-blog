import { config } from "dotenv";
config({ path: ".env.local" });
import { getEmailTemplate } from "../lib/email";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const ARTICLE_URL =
  "https://sutra.aiactuaries.org/ai-agents/reimagining-insurance-agentic-ai-model-office";
const LINKEDIN_POST_URL =
  "https://www.linkedin.com/posts/sssia_agenticai-insuranceinnovation-aiininsurance-activity-7435756231685734400-jtxb?utm_source=share&utm_medium=member_desktop&rcm=ACoAACQoYKYBxqD47HQIHQnSxWZSXRTJC1zKoNE";
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop";

async function broadcastAgenticAIArticle() {
  try {
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (!audienceId) {
      throw new Error("RESEND_AUDIENCE_ID is not set in .env.local");
    }

    const subject =
      "Reimagining Insurance with an Agentic AI–Driven Model Office";

    const contentHtml = `
      <img src="${HERO_IMAGE}" alt="Team planning and collaboration" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px; margin-bottom: 28px; display: block;" />
      <div style="text-transform: uppercase; font-size: 11px; letter-spacing: 0.2em; color: #71717a; margin-bottom: 10px; font-weight: 600;">
        AI Agents · New on Sutra
      </div>
      <h1 style="margin: 0 0 20px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 600; line-height: 1.25; color: #09090b;">
        Reimagining Insurance with an Agentic AI–Driven Model Office
      </h1>
      <p style="font-size: 17px; color: #27272a; margin-bottom: 24px; line-height: 1.6;">
        The insurance industry is entering a new era. In this piece, <strong>Satya Sai Mudigonda</strong> shares a framework for simulating a modern insurance enterprise using autonomous AI agents—from product development and underwriting to claims and risk management.
      </p>
      <div style="border-left: 3px solid #e4e4e7; padding-left: 20px; margin: 28px 0; font-style: italic; font-size: 16px; color: #52525b; line-height: 1.6;">
        A digital twin of an insurance company where AI agents perform domain-specific tasks and collaborate across departments—actuarial science, AI, and insurance analytics in one unified environment.
      </div>
      <p style="font-weight: 600; color: #18181b; margin-bottom: 12px; font-size: 15px;">
        What you’ll discover:
      </p>
      <ul style="margin: 0 0 28px 20px; padding: 0; color: #3f3f46; line-height: 1.8; font-size: 15px;">
        <li><strong>Product Development &amp; Underwriting</strong> — AI agents that analyze market trends, price risk, and support compliance</li>
        <li><strong>Actuarial Office</strong> — Pricing, reserving, experience studies, and stress testing powered by agentic workflows</li>
        <li><strong>Claims &amp; Risk Management</strong> — Streamlined claims lifecycle and intelligent risk analytics</li>
      </ul>
      <p style="margin-bottom: 28px; font-size: 15px; color: #52525b;">
        The article also explores how this model office serves as a platform for research, learning, and innovation—and what it means for the next generation of actuaries.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 32px 0;">
        <tr>
          <td style="text-align: center;">
            <a href="${ARTICLE_URL}" style="display: inline-block; background-color: #09090b; color: #ffffff !important; padding: 16px 32px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 15px;">Read the full article on Sutra</a>
          </td>
        </tr>
      </table>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 24px 0;">
        <tr>
          <td style="text-align: center; padding: 20px; background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 6px;">
            <p style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #71717a; font-weight: 600;">Join the conversation</p>
            <p style="margin: 0 0 14px 0; font-size: 14px; color: #27272a;">See the discussion on LinkedIn from Sri Sathya Sai Institute of Actuaries</p>
            <a href="${LINKEDIN_POST_URL}" style="display: inline-block; color: #0a66c2 !important; font-weight: 600; font-size: 14px; text-decoration: none;">View LinkedIn post →</a>
          </td>
        </tr>
      </table>
      <p style="margin-top: 32px; font-size: 14px; color: #71717a;">
        — Satya Sai Mudigonda, Chairman, SSSIA · Powered by aiactuaries.org
      </p>
    `;

    const fullHtml = getEmailTemplate(subject, contentHtml);

    console.log(`Preparing to broadcast: "${subject}"`);

    const { data: broadcast, error: createError } =
      await resend.broadcasts.create({
        audienceId,
        from: "New Blog Post<newsletter@sutra.rohanyashraj.com>",
        subject,
        replyTo: "satyasai@sssia.org",
        html: fullHtml,
        name: `Agentic AI Model Office - ${new Date().toISOString().slice(0, 10)}`,
      });

    if (createError) {
      console.error("Error creating broadcast:", createError);
      process.exit(1);
    }

    console.log("Broadcast created with ID:", broadcast.id);

    console.log("Sending broadcast...");
    const { data: sendData, error: sendError } = await resend.broadcasts.send(
      broadcast.id,
    );

    if (sendError) {
      console.error("Error sending broadcast:", sendError);
      process.exit(1);
    }

    console.log("Broadcast sent successfully.", sendData);
  } catch (error) {
    console.error("Script error:", error);
    process.exit(1);
  }
}

broadcastAgenticAIArticle();

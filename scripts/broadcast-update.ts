import { config } from "dotenv";
config({ path: ".env.local" });
import { getEmailTemplate } from "../lib/email";
import { Resend } from "resend";

// --- EDIT THESE VALUES ---
const SUBJECT = "Exclusive for Sutra Subscribers: SSSIA Membership Applications Open";
const SSSIA_WEBSITE_URL = "https://sssia.org";
const APPLICATION_FORM_URL = "https://forms.gle/u6sKYR3WVXpgGDGS7";
const LINKEDIN_POST_URL =
  "https://www.linkedin.com/posts/sssia_join-the-ai-actuaries-movement-activity-7442083390293708800-5g0M?utm_source=share&utm_medium=member_android&rcm=ACoAAC7XU3YBg2yxW7SqYHQBsWFiUwQRArbv_X8";
// Clean HTML - Styles are handled by getEmailTemplate
const CONTENT_HTML = `
  <h1>Exclusive Opportunity for Sutra Subscribers</h1>
  
  <p>
    Dear Sutra Subscribers,
  </p>
  
  <p>
    As a valued member of the Sutra community, you are receiving <strong>early access</strong> to apply for membership at the <strong>Sri Sathya Sai Institute of Actuaries (SSSIA)</strong>, powered by AI Actuaries.
  </p>

  <p>
    This is more than a membership form, it is a chance to be part of a focused actuarial movement shaped around modern practice, AI-first thinking, and continuous learning with a high-intent peer community.
  </p>

  <h2>Apply Now</h2>
  <p>
    Use this application link to submit your membership request:
  </p>
  <div style="text-align: center; margin: 24px 0;">
    <a href="${APPLICATION_FORM_URL}" class="btn">Apply for SSSIA Membership</a>
  </div>

  <h2>Why This Is Worth It</h2>
  
  <ul>
    <li><strong>Exclusive access:</strong> You are among a curated group invited from the Sutra subscriber base.</li>
    <li><strong>Future-ready learning:</strong> Engage with initiatives at the intersection of actuarial science and AI.</li>
    <li><strong>Serious community:</strong> Join professionals and learners committed to practical growth and impact.</li>
  </ul>

  <p>
    For additional context, explore the official announcement:
  </p>
  <div style="text-align: center; margin: 18px 0 8px 0;">
    <a href="${LINKEDIN_POST_URL}" style="color: #2563eb; text-decoration: underline; font-weight: 500;">View LinkedIn Announcement</a>
  </div>
  <div style="text-align: center; margin: 8px 0 22px 0;">
    <a href="${SSSIA_WEBSITE_URL}" style="color: #2563eb; text-decoration: underline; font-weight: 500;">Visit SSSIA</a>
  </div>

  <p>
    Happy Learning!
  </p>
`;
// -------------------------

const resend = new Resend(process.env.RESEND_API_KEY);

async function broadcastUpdate() {
  try {
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!audienceId) {
      throw new Error("RESEND_AUDIENCE_ID is not set in .env.local");
    }

    console.log(`Preparing to broadcast: "${SUBJECT}"`);

    // Use the shared template
    const fullHtml = getEmailTemplate(SUBJECT, CONTENT_HTML);

    // 1. Create Broadcast
    const { data: broadcast, error: createError } =
      await resend.broadcasts.create({
        audienceId,
        from: "Sutra Updates <newsletter@sutra.rohanyashraj.com>",
        subject: SUBJECT,
        replyTo: "satyasai@sssia.org",
        html: fullHtml,
        name: `SSSIA Membership Invite - ${new Date().toLocaleDateString()}`,
      });

    if (createError) {
      console.error("Error creating broadcast:", createError);
      process.exit(1);
    }

    console.log("Broadcast created successfully with ID:", broadcast.id);

    // 2. Send Broadcast
    console.log("Sending broadcast...");
    const { data: sendData, error: sendError } = await resend.broadcasts.send(
      broadcast.id,
    );

    if (sendError) {
      console.error("Error sending broadcast:", sendError);
      process.exit(1);
    }

    console.log("Broadcast sent successfully!", sendData);
  } catch (error) {
    console.error("Script error:", error);
    process.exit(1);
  }
}

broadcastUpdate();

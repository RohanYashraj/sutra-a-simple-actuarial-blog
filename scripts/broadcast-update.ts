import { config } from 'dotenv';
config({ path: '.env.local' });
import { getEmailTemplate } from '../lib/email';
import { Resend } from 'resend';

// --- EDIT THESE VALUES ---
const SUBJECT = "Update from Sutra";
// Clean HTML - Styles are handled by getEmailTemplate
const CONTENT_HTML = `
  <h1>Refining the Experience</h1>
  
  <p>
    Hello everyone,
  </p>
  
  <p>
    We've been hard at work behind the scenes to improve your reading experience. Here is a quick summary of the recent updates we've rolled out to the blog.
  </p>

  <h2>What's Changed?</h2>
  
  <ul>
    <li><strong>Rebranding to Sutra:</strong> We have officially adopted the name "Sutra" to reflect our focus on concise, high-value insights.</li>
    <li><strong>New Content Channels:</strong> Look out for our new segments including <em>Daily Trivia</em>, <em>Market Pulse</em>, and technical <em>Code Sutra</em> challenges.</li>
    <li><strong>Smoother Experience:</strong> We've updated the underlying tech stack for faster load times and a cleaner reading interface.</li>
  </ul>

  <p>
    Thank you for being part of our community as we continue to evolve.
  </p>

  <div style="text-align: center;">
    <a href="https://sutra.rohanyashraj.com" class="btn">Visit Sutra</a>
  </div>
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
        const { data: broadcast, error: createError } = await resend.broadcasts.create({
            audienceId,
            from: "Sutra Updates <newsletter@sutra.rohanyashraj.com>",
            subject: SUBJECT,
            replyTo: "rohanyashraj@gmail.com",
            html: fullHtml,
            name: `Manual Update - ${new Date().toLocaleDateString()}`,
        });

        if (createError) {
            console.error("Error creating broadcast:", createError);
            process.exit(1);
        }

        console.log("Broadcast created successfully with ID:", broadcast.id);

        // 2. Send Broadcast
        console.log("Sending broadcast...");
        const { data: sendData, error: sendError } = await resend.broadcasts.send(broadcast.id);

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

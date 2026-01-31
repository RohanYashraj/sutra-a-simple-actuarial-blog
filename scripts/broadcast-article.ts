import { config } from 'dotenv';
config({ path: '.env.local' });
import { getEmailTemplate } from '../lib/email';
import { getArticleData } from '../lib/articles';
import { Resend } from 'resend';
import { sanitizeSlug } from '../lib/slug';

const resend = new Resend(process.env.RESEND_API_KEY);

async function broadcastArticle() {
    const slug = process.argv[2];

    if (!slug) {
        console.error("Usage: npx tsx scripts/broadcast-article.ts <article-slug>");
        process.exit(1);
    }

    try {
        const audienceId = process.env.RESEND_AUDIENCE_ID;
        if (!audienceId) {
            throw new Error("RESEND_AUDIENCE_ID is not set in .env.local");
        }

        console.log(`Fetching article data for: ${slug}...`);
        const article = await getArticleData(slug);

        const siteUrl = 'https://sutra.rohanyashraj.com';
        const articleUrl = `${siteUrl}/${sanitizeSlug(article.category)}/${article.id}`;

        const subject = `New Article: ${article.title}`;

        const contentHtml = `
            <h1>${article.title}</h1>
            <p style="font-style: italic; color: #71717a; margin-bottom: 24px;">
                ${article.description}
            </p>
            <div class="article-preview">
                ${article.contentHtml.split('</p>')[0] + '</p>'}
                <p>...</p>
            </div>
            <div style="text-align: center; margin-top: 32px;">
                <a href="${articleUrl}" class="btn">Read the Full Article</a>
            </div>
        `;

        const fullHtml = getEmailTemplate(subject, contentHtml);

        console.log(`Preparing to broadcast: "${subject}"`);

        // 1. Create Broadcast
        const { data: broadcast, error: createError } = await resend.broadcasts.create({
            audienceId,
            from: "Sutra Updates <newsletter@sutra.rohanyashraj.com>",
            subject: subject,
            replyTo: "rohanyashraj@gmail.com",
            html: fullHtml,
            name: `Article Broadcast - ${article.title} - ${new Date().toLocaleDateString()}`,
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

broadcastArticle();

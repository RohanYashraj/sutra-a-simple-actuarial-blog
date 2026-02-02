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

        const subject = `Fresh off the press: ${article.title}`;

        const contentHtml = `
            <div style="text-transform: uppercase; font-size: 12px; letter-spacing: 0.1em; color: #a1a1aa; margin-bottom: 8px; font-weight: 600;">
                New Blog
            </div>
            <h1 style="margin-top: 0;">${article.title}</h1>
            <p style="font-size: 18px; color: #3f3f46; margin-bottom: 24px; line-height: 1.5;">
                ${article.description}
            </p>
            <div style="border-left: 3px solid #f4f4f5; padding-left: 20px; font-family: 'Cormorant Garamond', serif; font-size: 18px; font-style: italic; color: #52525b; margin-bottom: 32px;">
                ${article.contentHtml.split('</p>')[0].replace('<p>', '').replace('</p>', '')}...
            </div>
            <p style="margin-bottom: 32px;">
                I've just published a new piece exploring the intersections of actuarial science and modern technology. I think you'll find this perspective particularly relevant to where our profession is heading.
            </p>
            <div style="text-align: center; margin-top: 32px;">
                <a href="${articleUrl}" class="btn" style="background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 16px;">Read the Full Article</a>
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

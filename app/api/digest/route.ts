import { getSortedArticles } from '@/lib/articles'
import { Resend } from 'resend'
import { NextResponse, connection } from 'next/server'
import { getEmailTemplate } from '@/lib/email'
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const resend = new Resend(process.env.RESEND_API_KEY)
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)


export async function triggerDigestBroadcast() {
  try {
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!audienceId) {
      throw new Error("RESEND_AUDIENCE_ID is not set");
    }

    // 1. Fetch top 3 latest articles
    const articles = getSortedArticles().slice(0, 3);

    // 2. Format HTML
    const emailHtml = getEmailTemplate(
      'Sutra Digest',
      `
              <h1>Sutra Digest</h1>
              <p>The week's latest actuarial insights and tech deep-dives:</p>
              
              ${articles.map((article, index) => `
                <div style="margin-bottom: 32px; ${index < articles.length - 1 ? 'border-bottom: 1px solid #f4f4f5; padding-bottom: 32px;' : ''}">
                  <h3 style="margin-bottom: 12px; font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 600; line-height: 1.2;">
                    <a href="https://sutra.rohanyashraj.com/${article.category.toLowerCase().replace(/\s+/g, '-')}/${article.id}" style="color: #000000 !important; text-decoration: none;">
                      ${article.title}
                    </a>
                  </h3>
                  <p style="font-size: 15px; color: #3f3f46; margin-bottom: 20px; line-height: 1.5;">${article.description}</p>
                  
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td>
                        <a href="https://sutra.rohanyashraj.com/${article.category.toLowerCase().replace(/\s+/g, '-')}/${article.id}" style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none; color: #000000 !important; border-bottom: 1px solid #000000;">Read Article</a>
                      </td>
                      <td style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a; text-align: right;">
                        ${article.date} • Rohan Yashraj Gupta
                      </td>
                    </tr>
                  </table>
                </div>
              `).join('')}
              
              <div style="text-align: center; margin-top: 40px;">
                <a href="https://sutra.rohanyashraj.com" class="btn">Visit Website</a>
              </div>
            `
    );

    // 3. Create Resend Broadcast
    const { data, error } = await resend.broadcasts.create({
      audienceId: audienceId,
      from: 'Sutra | Digest <newsletter@sutra.rohanyashraj.com>',
      subject: 'Weekly Digest - Sutra Blog',
      replyTo: 'rohanyashraj@gmail.com',
      html: emailHtml,
      name: `Sutra Digest - ${new Date().toLocaleDateString()}`
    });

    if (error || !data) {
      throw new Error(`Resend Broadcast Error: ${error?.message || 'Unknown error'}`);
    }

    // 4. Send the broadcast immediately
    const { error: sendError } = await resend.broadcasts.send(data.id);

    return {
      broadcastId: data.id
    };

  } catch (error: any) {
    console.error('Digest Error:', error);
    throw error;
  }
}

export async function GET() {
  await connection();
  try {
    const result = await triggerDigestBroadcast();
    return NextResponse.json({
      message: 'Broadcast sent successfully',
      ...result
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

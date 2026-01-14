import { getSortedArticles } from '@/lib/articles'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { getEmailTemplate } from '@/lib/email'

const resend = new Resend(process.env.RESEND_API_KEY)

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const audienceId = process.env.RESEND_AUDIENCE_ID

    if (!audienceId) {
      return NextResponse.json(
        { error: 'RESEND_AUDIENCE_ID is not set' },
        { status: 500 }
      )
    }

    // 1. Fetch top 3 latest articles
    const articles = getSortedArticles().slice(0, 3)

    // 2. Fetch all contacts from Audience
    // Note: This API call fetches one page of contacts, which is fine for MVP.
    const emailContent = getEmailTemplate(
      'Daily Digest',
      `
              <h1>Daily Digest</h1>
              <p>Here are the latest insights from Sutra:</p>
              
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
    )

    // 3. Send via Resend Broadcasts
    // This is more efficient and handles unsubscribes automatically
    const { data, error } = await resend.broadcasts.create({
      audienceId: audienceId,
      from: 'Sutra Blog <newsletter@sutra.rohanyashraj.com>',
      subject: 'Daily Digest - Sutra Blog',
      replyTo: 'rohanyashraj@gmail.com',
      html: emailContent,
      name: `Daily Digest - ${new Date().toLocaleDateString()}`
    })

    if (error || !data) {
      console.error('Resend Broadcast Error:', error)
      return NextResponse.json({ error: 'Failed to create broadcast' }, { status: 500 })
    }

    // 4. Send the broadcast immediately
    const { error: sendError } = await resend.broadcasts.send(data.id)

    if (sendError) {
      console.error('Resend Broadcast Send Error:', sendError)
      return NextResponse.json({ error: 'Failed to send broadcast' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Broadcast sent successfully',
      broadcastId: data.id
    })

  } catch (error) {
    console.error('Digest Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

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
    // Ideally we iterate or use broadcast API, but sticking to "simple loop" per requirement.
    const { data: contacts, error: contactsError } = await resend.contacts.list({
      audienceId: audienceId,
    })

    if (contactsError || !contacts) {
      throw new Error('Failed to fetch contacts')
    }

    if (contacts.data.length === 0) {
      return NextResponse.json({ message: 'No subscribers to email.' })
    }

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

    // 3. Send single email with BCC
    // Note: Resend has limits on BCC (per request). 
    // If the list grows large, we should switch back to batching or loops.
    const subscriberEmails = contacts.data.map(contact => contact.email)

    await resend.emails.send({
      from: 'Sutra Blog <newsletter@sutra.rohanyashraj.com>',
      to: 'rohanyashraj@gmail.com', // Sent to owner
      // cc: 'rohanyashraj@gmail.com',
      bcc: subscriberEmails,
      replyTo: 'rohanyashraj@gmail.com',
      subject: 'Daily Digest - Sutra Blog',
      html: emailContent
    })

    return NextResponse.json({
      message: 'Digest sent',
      recipientCount: subscriberEmails.length
    })

  } catch (error) {
    console.error('Digest Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

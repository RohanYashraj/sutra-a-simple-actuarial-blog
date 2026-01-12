import { getSortedArticles } from '@/lib/articles'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

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

        const emailContent = `
      <h1>Daily Digest: Top 3 Latest Posts</h1>
      <p>Here are the latest insights from Sutra:</p>
      <ul>
        ${articles.map(article => `
          <li>
            <a href="https://sutra.rohanyashraj.com/${article.category.toLowerCase().replace(/\s+/g, '-')}/${article.id}">
              <strong>${article.title}</strong>
            </a>
            <br/>
            <span>${article.description}</span>
          </li>
        `).join('')}
      </ul>
      <p>Read more at <a href="https://sutra.rohanyashraj.com">sutra.rohanyashraj.com</a></p>
    `

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

import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const audienceId = process.env.RESEND_AUDIENCE_ID

    if (!email || !audienceId) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    try {
        // Efficiently find the contact in the audience
        // Note: For large audiences, pagination would be required here.
        const { data: contacts } = await resend.contacts.list({ audienceId })
        const contact = contacts?.data.find(c => c.email === email)

        if (contact) {
            // Mark as unsubscribed rather than removing to maintain record 
            // and prevent unwanted re-subscriptions
            await resend.contacts.update({
                id: contact.id,
                audienceId,
                unsubscribed: true
            })
        }

        // Redirect to a confirmation page
        return NextResponse.redirect(new URL('/unsubscribe/success', request.url))

    } catch (error) {
        console.error('Unsubscribe error:', error)
        return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 })
    }
}

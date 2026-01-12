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
        // We find the contact first to get their ID if possible, 
        // but Resend.contacts.remove works with ID.
        // For simplicity, we'll use the "patch" method to set unsubscribed: true
        // or just delete them from the audience.

        // Let's use the list method to find the contact ID by email
        const { data: contacts } = await resend.contacts.list({ audienceId })
        const contact = contacts?.data.find(c => c.email === email)

        if (contact) {
            await resend.contacts.remove({
                id: contact.id,
                audienceId
            })
        }

        // Redirect to a confirmation page
        return NextResponse.redirect(new URL('/unsubscribe/success', request.url))

    } catch (error) {
        console.error('Unsubscribe error:', error)
        return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 })
    }
}

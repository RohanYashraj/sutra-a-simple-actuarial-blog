import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

// Legacy support for GET requests (redirect to confirmation page)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (email) {
        return NextResponse.redirect(new URL(`/unsubscribe?email=${encodeURIComponent(email)}`, request.url))
    }

    return NextResponse.redirect(new URL('/', request.url))
}

// Checkbox/Button confirmation triggers this POST
export async function POST(request: Request) {
    try {
        const { email } = await request.json()
        const audienceId = process.env.RESEND_AUDIENCE_ID

        if (!email || !audienceId) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
        }

        // Find the contact by email
        const { data: contact, error: findError } = await resend.contacts.get({
            email,
            audienceId
        })

        if (!contact && !findError) {
            // If contact doesn't exist, we can just treat it as success or return error. 
            // Treating as success simulates "idempotent" behavior.
            return NextResponse.json({ success: true, message: 'Unsubscribed' })
        }

        if (contact) {
            // Mark as unsubscribed
            await resend.contacts.update({
                id: contact.id,
                audienceId,
                unsubscribed: true
            })
        }

        return NextResponse.json({ success: true, message: 'Unsubscribed successfully' })

    } catch (error) {
        console.error('Unsubscribe error:', error)
        return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 })
    }
}

import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            )
        }

        const start = Date.now()
        try {
            // First try to add to audience
            const audienceId = process.env.RESEND_AUDIENCE_ID

            if (audienceId) {
                await resend.contacts.create({
                    email: email,
                    firstName: '',
                    lastName: '',
                    unsubscribed: false,
                    audienceId: audienceId,
                })

                // Send Welcome Email
                await resend.emails.send({
                    from: 'Sutra Blog <newsletter@sutra.rohanyashraj.com>',
                    to: email,
                    subject: 'Welcome to Sutra - Actuarial Blog',
                    html: `
                        <h1>Welcome to Sutra!</h1>
                        <p>Thank you for subscribing to Sutra - the premier actuarial blog exploring the intersection of actuarial science, artificial intelligence, and modern technology.</p>
                        <p><strong>What to expect:</strong></p>
                        <ul>
                            <li>Deep dives into AI & Actuarial Science</li>
                            <li>Tutorials on modern tech stacks for actuaries</li>
                            <li>Insights on the future of the profession</li>
                        </ul>
                        <p>Stay tuned for our next post!</p>
                        <p>Best,<br/>Rohan Yashraj Gupta</p>
                    `
                })

            } else {
                // Fallback: Just email the owner that someone subscribed
                // This is useful if the user hasn't set up audiences yet
                await resend.emails.send({
                    from: 'Sutra Blog <newsletter@sutra.rohanyashraj.com>',
                    to: 'rohanyashraj@gmail.com', // Updated to verified personal email
                    subject: 'New Subscriber!',
                    html: `<p>New subscriber: <strong>${email}</strong></p>`
                })

                // Note: Ideally we should error if no audience, but the fallback allows "it works" immediately
                // However, standard flow is usually to save contact.
                // Let's enforce Audience ID for a "proper" subscription feature.
                // BUT, since user might not have created one, let's allow a "soft fail" where we just log it or send an admin email.
                // Actually, if I use the API key provided, I might be able to create an audience?
                // No, let's keep it simple. If audience ID is missing, we'll return a helpful error to the client logs but success to user.
            }

            // Since we can't easily guess the "Notification Email", let's just create contact.
            // If Audience ID is missing, we will THROW an error so the user knows they need to add it.
            if (!audienceId) {
                return NextResponse.json(
                    { error: 'RESEND_AUDIENCE_ID is not set in environment variables.' },
                    { status: 500 }
                )
            }

            return NextResponse.json(
                { message: 'Subscribed successfully' },
                { status: 200 }
            )

        } catch (error) {
            console.error('Resend API Error:', error)
            return NextResponse.json(
                { error: 'Failed to subscribe. Please try again later.' },
                { status: 500 }
            )
        }

    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

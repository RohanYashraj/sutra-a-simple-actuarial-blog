import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { getEmailTemplate } from '@/lib/email'

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
                const welcomeHtml = getEmailTemplate(
                    'Welcome to Sutra',
                    `
                    <h1>Welcome & Namaste</h1>
                    <p>Thank you for subscribing to <strong>Sutra</strong>. In Sanskrit, a <em>Sutra</em> is a thread—a concise rule or aphorism that connects complex ideas into a cohesive whole.</p>
                    
                    <p>This blog is my attempt to find that thread within our profession. We are standing at a unique intersection where traditional actuarial rigor meets the exponential leap of Artificial Intelligence. But beyond the numbers and the code, there is always a human story.</p>

                    <h2>The Journey Ahead</h2>
                    <p>By joining this community, you'll receive insights that lean into three core areas:</p>
                    <ul>
                        <li><strong>The Numbers:</strong> Deep dives into risk modeling, technical actuarial concepts, and the mathematics of insurance.</li>
                        <li><strong>The AI:</strong> Practical tutorials on LLMs, Python automation, and how Generative AI is reshaping the way we work.</li>
                        <li><strong>The Human Side:</strong> Philosophical perspectives on the actuary's role in a post-AI world and the ethics of technology.</li>
                    </ul>
                    
                    <p>I'm glad to have you with us as we explore these threads together.</p>
                    <br/>
                    <p>With gratitude,<br/><strong>Rohan Yashraj Gupta</strong></p>
                  `,
                    email
                )

                await resend.emails.send({
                    from: 'Sutra Blog <newsletter@sutra.rohanyashraj.com>',
                    to: email,
                    bcc: 'sutrarohanyashraj@gmail.com',
                    subject: 'Welcome to Sutra - A Simple Actuarial Blog',
                    html: welcomeHtml
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


require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function notify() {
    try {
        const ownerEmail = 'rohanyashraj@gmail.com'; // Hardcoded for now based on context, or could be env var

        console.log('Sending notification email to owner...');

        // In a real scenario, we might fetch the latest post here.
        // For now, we'll send a template that the owner can forward.

        const { data, error } = await resend.emails.send({
            from: 'Sutra Blog <newsletter@sutra.rohanyashraj.com>',
            to: ownerEmail,
            subject: 'Action Required: Send New Post Notification',
            html: `
        <h1>New Post Published!</h1>
        <p>A new post has been published on Sutra.</p>
        <p><strong>Action:</strong> Log in to the Resend Dashboard to send a broadcast to your audience.</p>
        <p><a href="https://resend.com/emails">Go to Resend Dashboard</a></p>
      `
        });

        if (error) {
            console.error('Error sending email:', error);
            process.exit(1);
        }

        console.log('Notification email sent successfully:', data);
    } catch (error) {
        console.error('Script error:', error);
        process.exit(1);
    }
}

notify();

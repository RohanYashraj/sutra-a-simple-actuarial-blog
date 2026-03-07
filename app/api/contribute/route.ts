import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.RESEND_CONTACT_FROM ??
  "Sutra Blog <contact@sutra.aiactuaries.org>";
const BCC_EMAILS = [
  "support@sssia.org",
  "satyasai@sssia.org",
  "rohanyashraj@gmail.com",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, contributionType, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Message must be under 5000 characters." },
        { status: 400 },
      );
    }

    const typeLabel = contributionType || "General contribution";
    const html = buildContributeEmailHtml({
      name: name.trim(),
      email: email.trim(),
      contributionType: typeLabel,
      message: message.trim(),
    });

    const submitterEmail = email.trim();
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: submitterEmail,
      bcc: BCC_EMAILS,
      replyTo: submitterEmail,
      subject: `[Sutra] Contribution: ${typeLabel} – ${name}`,
      html,
    });

    if (error) {
      console.error("Resend contribute error:", error);
      return NextResponse.json(
        { error: "Failed to send your message. Please try again later." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Contribute API error:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildContributeEmailHtml(params: {
  name: string;
  email: string;
  contributionType: string;
  message: string;
}): string {
  const { name, email, contributionType, message } = params;
  const n = escapeHtml(name);
  const e = escapeHtml(email);
  const c = escapeHtml(contributionType);
  const m = escapeHtml(message).replace(/\n/g, "<br />");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Contribution inquiry – Sutra</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0; padding:0; background-color:#fafafa; font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <div style="padding: 32px 16px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 580px; margin: 0 auto;">
      <tr>
        <td style="padding: 48px 40px; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 2px;">
          <!-- Header: sutra. branding -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td style="padding-bottom: 32px; border-bottom: 1px solid #f4f4f5;">
                <a href="https://sutra.aiactuaries.org" style="font-size: 28px; font-weight: 700; letter-spacing: -0.025em; color: #09090b; text-decoration: none; font-family: Georgia, 'Times New Roman', serif;">sutra<span style="color: #a1a1aa;">.</span></a>
              </td>
            </tr>
          </table>
          <!-- Title -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td style="padding-top: 28px; padding-bottom: 8px;">
                <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em; color: #71717a;">Contribution inquiry</p>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 28px;">
                <h1 style="margin: 0; font-size: 32px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.2; color: #09090b; font-family: Georgia, 'Times New Roman', serif;">New message</h1>
              </td>
            </tr>
          </table>
          <!-- Details -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 1px solid #e4e4e7; border-radius: 2px;">
            <tr>
              <td style="padding: 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="padding-bottom: 16px;">
                      <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #71717a;">From</p>
                      <p style="margin: 0; font-size: 16px; font-weight: 500; color: #09090b;">${n}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 16px;">
                      <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #71717a;">Email</p>
                      <p style="margin: 0; font-size: 16px; color: #27272a;"><a href="mailto:${e}" style="color: #27272a; text-decoration: underline; text-decoration-color: #d4d4d8;">${e}</a></p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 0;">
                      <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #71717a;">Contribution type</p>
                      <p style="margin: 0; font-size: 16px; color: #27272a;">${c}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <!-- Message -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td style="padding-top: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #71717a;">Message</p>
                <div style="padding: 20px; background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 2px;">
                  <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #27272a; white-space: pre-wrap;">${m}</p>
                </div>
              </td>
            </tr>
          </table>
          <!-- Footer -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td style="padding-top: 40px; border-top: 1px solid #f4f4f5; text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #a1a1aa;">Sutra – Actuarial blog</p>
                <p style="margin: 4px 0 0 0;"><a href="https://sutra.aiactuaries.org" style="font-size: 12px; color: #71717a; text-decoration: none;">sutra.aiactuaries.org</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

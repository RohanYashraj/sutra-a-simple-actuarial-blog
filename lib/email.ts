export const getEmailTemplate = (
  title: string,
  content: string,
  recipientEmail?: string,
) => {
  const unsubscribeUrl = recipientEmail
    ? `https://sutra.aiactuaries.org/unsubscribe?email=${encodeURIComponent(recipientEmail)}`
    : `https://sutra.aiactuaries.org/unsubscribe?email={{{EMAIL}}}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="x-apple-disable-message-reformatting">
        <meta name="color-scheme" content="light only">
        <meta name="supported-color-schemes" content="light">
        <style>
          :root {
            --bg: #eef2f7;
            --paper: #ffffff;
            --ink: #111827;
            --muted: #6b7280;
            --line: #e5e7eb;
            --line-soft: #edf1f5;
            --brand: #0f172a;
            --brand-soft: #334155;
            --accent: #1d4ed8;
          }
          body {
            font-family: 'Outfit', 'Avenir Next', 'Segoe UI', Helvetica, Arial, sans-serif;
            background: radial-gradient(circle at 20% -10%, #dbeafe 0, rgba(219, 234, 254, 0) 40%), radial-gradient(circle at 90% 0%, #ede9fe 0, rgba(237, 233, 254, 0) 35%), var(--bg);
            color: var(--ink);
            margin: 0;
            padding: 0;
            line-height: 1.72;
            -webkit-font-smoothing: antialiased;
          }
          .page {
            padding: 34px 14px;
          }
          .container {
            max-width: 580px;
            margin: 0 auto;
            padding: 0;
            background-color: var(--paper);
            border-radius: 20px;
            border: 1px solid var(--line);
            box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
            overflow: hidden;
          }
          .header {
            text-align: center;
            margin: 0;
            padding: 28px 30px 22px 30px;
            background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
            border-bottom: 1px solid var(--line-soft);
          }
          .logo {
            font-family: 'Outfit', 'Avenir Next', 'Segoe UI', Helvetica, Arial, sans-serif;
            font-size: 34px;
            font-weight: 700;
            letter-spacing: -0.04em;
            color: var(--brand) !important;
            text-decoration: none !important;
            display: inline-block;
            margin-bottom: 10px;
          }
          .logo-dot {
            color: #64748b !important;
          }
          .eyebrow {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 999px;
            background: #eff6ff;
            border: 1px solid #dbeafe;
            color: #1e3a8a;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          .title {
            margin: 14px 0 0 0;
            font-size: 14px;
            color: var(--muted);
            letter-spacing: 0.02em;
          }
          .content {
            margin: 0;
            padding: 36px 32px 26px 32px;
          }
          h1 {
            font-family: 'Cormorant Garamond', 'Georgia', 'Times New Roman', serif;
            font-size: 31px;
            font-weight: 600;
            margin: 0 0 12px 0;
            color: var(--brand);
            line-height: 1.22;
            letter-spacing: -0.01em;
          }
          h2 {
            font-family: 'Outfit', 'Avenir Next', 'Segoe UI', Helvetica, Arial, sans-serif;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #64748b;
            margin: 0 0 12px 0;
          }
          p {
            margin-bottom: 16px;
            color: #1f2937;
            font-size: 15px;
            line-height: 1.7;
          }
          ul {
            padding-left: 20px;
            margin-bottom: 24px;
          }
          li {
            margin-bottom: 8px;
            color: #1f2937;
          }
          a {
            color: var(--accent) !important;
            text-decoration: underline;
            text-decoration-color: #93c5fd;
            text-underline-offset: 3px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            margin-top: 22px;
            padding: 24px 30px 30px 30px;
            border-top: 1px solid var(--line-soft);
            background: #fcfdff;
          }
          .unsubscribe {
            color: #94a3b8 !important;
            text-decoration: underline;
            font-size: 11px;
          }
          .btn {
            display: inline-block;
            background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
            color: #ffffff !important;
            padding: 14px 30px;
            text-decoration: none !important;
            border-radius: 10px;
            border: 1px solid #1e40af;
            box-shadow: 0 8px 18px rgba(30, 58, 138, 0.22);
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.03em;
            text-transform: uppercase;
            margin-top: 16px;
          }
          img {
            max-width: 100%;
            height: auto;
            border-radius: 12px;
            display: block;
            margin: 6px auto 24px auto;
          }
          @media only screen and (max-width: 620px) {
            .page {
              padding: 8px !important;
            }
            .container {
              max-width: 100% !important;
              border-radius: 14px !important;
            }
            .header {
              padding: 22px 18px 18px 18px !important;
            }
            .content {
              padding: 28px 18px 18px 18px !important;
            }
            .footer {
              padding: 20px 18px 24px 18px !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="container">
            <div class="header">
              <a href="https://sutra.aiactuaries.org" class="logo" style="color: #1f2937; text-decoration: none;">sutra<span class="logo-dot" style="color: #9ca3af;">.</span></a>
            </div>
            <div class="content">
              ${content}
              <p style="margin-top: 54px; color: #64748b; font-size: 14px;">With regards,<br/><strong style="color: #1f2937;">Rohan Yashraj Gupta</strong></p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Sutra by Rohan Yashraj Gupta.<br>
              <a href="https://sutra.aiactuaries.org" style="color: #94a3b8 !important; text-decoration: none;">sutra.aiactuaries.org</a>
              <br/><br/>
              <p style="font-size: 11px; color: #cbd5e1;">You are receiving this email because you subscribed to our newsletter.</p>
              <a href="${unsubscribeUrl}" class="unsubscribe">Unsubscribe</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

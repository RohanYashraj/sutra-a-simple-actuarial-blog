export const getEmailTemplate = (
  title: string,
  content: string,
  recipientEmail?: string,
) => {
  const unsubscribeUrl = recipientEmail
    ? `https://sutra.rohanyashraj.com/unsubscribe?email=${encodeURIComponent(recipientEmail)}`
    : `https://sutra.rohanyashraj.com/unsubscribe?email={{{EMAIL}}}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Outfit', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f5f5f0;
            color: #374151;
            margin: 0;
            padding: 0;
            line-height: 1.7;
            -webkit-font-smoothing: antialiased;
          }
          .page {
            padding: 32px 16px;
          }
          .container {
            max-width: 580px;
            margin: 0 auto;
            padding: 48px 36px;
            background-color: #ffffff;
            border-radius: 16px;
            border: 1px solid #e8e8e3;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 24px;
            border-bottom: 1px solid #f0eeeb;
          }
          .logo {
            font-family: 'Outfit', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -0.04em;
            color: #1f2937 !important;
            text-decoration: none !important;
            display: inline-block;
          }
          .logo-dot {
            color: #9ca3af !important;
          }
          .content {
            margin-bottom: 32px;
          }
          h1 {
            font-family: 'Cormorant Garamond', 'Georgia', 'Times New Roman', serif;
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #1f2937;
            line-height: 1.3;
          }
          h2 {
            font-family: 'Outfit', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: #6b7280;
            margin-top: 0;
            margin-bottom: 12px;
          }
          p {
            margin-bottom: 16px;
            color: #374151;
            font-size: 15px;
            line-height: 1.7;
          }
          ul {
            padding-left: 20px;
            margin-bottom: 24px;
          }
          li {
            margin-bottom: 8px;
            color: #374151;
          }
          a {
            color: #4b5563 !important;
            text-decoration: underline;
            text-decoration-color: #d1d5db;
            text-underline-offset: 3px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            margin-top: 48px;
            padding-top: 24px;
            border-top: 1px solid #f0eeeb;
          }
          .unsubscribe {
            color: #9ca3af !important;
            text-decoration: underline;
            font-size: 11px;
          }
          .btn {
            display: inline-block;
            background-color: #1f2937;
            color: #ffffff !important;
            padding: 14px 32px;
            text-decoration: none !important;
            border-radius: 999px;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.02em;
            margin-top: 16px;
          }
          img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            display: block;
            margin: 24px auto;
          }
          @media only screen and (max-width: 620px) {
            .page {
              padding: 0 !important;
            }
            .container {
              max-width: 100% !important;
              border-radius: 0 !important;
              border: none !important;
              padding: 32px 20px !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="container">
            <div class="header">
              <a href="https://sutra.rohanyashraj.com" class="logo" style="color: #1f2937; text-decoration: none;">sutra<span class="logo-dot" style="color: #9ca3af;">.</span></a>
            </div>
            <div class="content">
              ${content}
              <p style="margin-top: 56px; color: #6b7280; font-size: 14px;">With regards,<br/><strong style="color: #374151;">Rohan Yashraj Gupta</strong></p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Sutra by Rohan Yashraj Gupta.<br>
              <a href="https://sutra.rohanyashraj.com" style="color: #9ca3af !important; text-decoration: none;">sutra.rohanyashraj.com</a>
              <br/><br/>
              <p style="font-size: 11px; color: #d1d5db;">You are receiving this email because you subscribed to our newsletter.</p>
              <a href="${unsubscribeUrl}" class="unsubscribe">Unsubscribe</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

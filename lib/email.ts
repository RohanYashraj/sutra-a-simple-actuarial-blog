export const getEmailTemplate = (title: string, content: string, recipientEmail?: string) => {
    const unsubscribeUrl = recipientEmail
        ? `https://sutra.rohanyashraj.com/api/unsubscribe?email=${encodeURIComponent(recipientEmail)}`
        : 'https://sutra.rohanyashraj.com';

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Outfit:wght@400;700&display=swap');
          
          body {
            font-family: 'Outfit', Helvetica, Arial, sans-serif;
            background-color: #ffffff;
            color: #000000;
            margin: 0;
            padding: 0;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 1px solid #f4f4f5;
          }
          .logo {
            font-family: 'Outfit', Helvetica, Arial, sans-serif;
            font-size: 36px;
            font-weight: 700;
            letter-spacing: -0.05em;
            color: #000000 !important;
            text-decoration: none !important;
            display: inline-block;
          }
          .logo-dot {
            color: #a1a1aa !important;
          }
          .content {
            margin-bottom: 40px;
          }
          h1 {
            font-family: 'Cormorant Garamond', 'Times New Roman', serif;
            font-size: 32px;
            font-weight: 600;
            margin-bottom: 24px;
            color: #000000;
            line-height: 1.2;
          }
          h2 {
            font-family: 'Cormorant Garamond', 'Times New Roman', serif;
            font-size: 24px;
            font-weight: 600;
            margin-top: 32px;
            margin-bottom: 16px;
            color: #000000;
          }
          p {
            margin-bottom: 16px;
            color: #000000;
            font-size: 16px;
          }
          ul {
            padding-left: 20px;
            margin-bottom: 24px;
          }
          li {
            margin-bottom: 8px;
            color: #000000;
          }
          a {
            color: #000000 !important;
            text-decoration: underline;
            text-underline-offset: 4px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #a1a1aa;
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid #f4f4f5;
            letter-spacing: 0.05em;
          }
          .unsubscribe {
            color: #a1a1aa !important;
            text-decoration: underline;
            font-size: 10px;
          }
          .btn {
            display: inline-block;
            background-color: #000000;
            color: #ffffff !important;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            margin-top: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <a href="https://sutra.rohanyashraj.com" class="logo" style="color: #000000; text-decoration: none;">sutra<span class="logo-dot" style="color: #a1a1aa;">.</span></a>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Sutra by Rohan Yashraj Gupta.<br>
            <a href="https://sutra.rohanyashraj.com" style="color: #a1a1aa; text-decoration: none;">sutra.rohanyashraj.com</a>
            <br/><br/>
            <p style="font-size: 10px; color: #d4d4d8;">You are receiving this email because you subscribed to our newsletter.</p>
            <a href="${unsubscribeUrl}" class="unsubscribe">Unsubscribe</a>
          </div>
        </div>
      </body>
    </html>
  `
}

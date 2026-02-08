const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Please fill in all required fields (Name, Email, Message).' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `New Contact Form Submission - ${subject || 'General Inquiry'} | ${name}`,
            html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa; line-height: 1.6; -webkit-font-smoothing: antialiased; }
            .wrapper { padding: 40px 20px; }
            .container { max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); overflow: hidden; }
            .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 40px 35px; color: #ffffff; }
            .header-title { font-size: 26px; font-weight: 600; margin-bottom: 8px; }
            .header-subtitle { font-size: 15px; opacity: 0.95; font-weight: 400; }
            .content { padding: 45px 40px; }
            .info-section { margin-bottom: 35px; }
            .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #64748b; margin-bottom: 15px; }
            .info-grid { display: table; width: 100%; border-collapse: separate; border-spacing: 0 12px; }
            .info-row { display: table-row; }
            .info-label { display: table-cell; font-size: 14px; color: #475569; font-weight: 500; padding-right: 20px; width: 140px; vertical-align: top; padding-top: 3px; }
            .info-value { display: table-cell; font-size: 15px; color: #0f172a; font-weight: 400; }
            .info-value a { color: #3b82f6; text-decoration: none; }
            .info-value a:hover { text-decoration: underline; }
            .divider { height: 1px; background: linear-gradient(to right, transparent, #e2e8f0 20%, #e2e8f0 80%, transparent); margin: 35px 0; }
            .message-section { margin-top: 35px; }
            .message-box { background: linear-gradient(to bottom, #f8fafc, #ffffff); border: 1px solid #e2e8f0; border-left: 4px solid #3b82f6; border-radius: 6px; padding: 25px; font-size: 15px; color: #334155; line-height: 1.7; white-space: pre-wrap; word-wrap: break-word; }
            .footer { background-color: #f8fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
            .footer-text { font-size: 13px; color: #64748b; margin-bottom: 8px; }
            .footer-brand { font-size: 14px; color: #475569; font-weight: 600; margin-top: 12px; }
            .badge { display: inline-block; background-color: #dbeafe; color: #1e40af; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-left: 8px; }
            .not-provided { color: #94a3b8; font-style: italic; }
            @media only screen and (max-width: 600px) {
                .wrapper { padding: 20px 10px; }
                .header, .content, .footer { padding-left: 25px; padding-right: 25px; }
                .info-grid { display: block; }
                .info-row { display: block; margin-bottom: 15px; }
                .info-label, .info-value { display: block; width: 100%; }
                .info-label { margin-bottom: 5px; }
            }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="container">
                <div class="header">
                    <div class="header-title">New Contact Inquiry Received</div>
                    <div class="header-subtitle">A potential client has reached out through your website</div>
                </div>
                
                <div class="content">
                    <div class="info-section">
                        <div class="section-title">Contact Information</div>
                        <div class="info-grid">
                            <div class="info-row">
                                <div class="info-label">Name: ${name}</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Email: ${email}</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Phone: ${phone || '<span class="not-provided">Not provided</span>'}</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Subject: ${subject || 'General Inquiry'}</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Received: ${new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="message-section">
                        <div class="section-title">Message Details</div>
                        <div class="message-box">${message}</div>
                    </div>
                </div>
                
                <div class="footer">
                    <div class="footer-text">This inquiry was submitted via the Travya Infra contact form</div>
                    <div class="footer-brand">Travya Infra &copy; ${new Date().getFullYear()}</div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: 'Enquiry sent successfully!' });

    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, message: 'Failed to send enquiry.', error: error.message });
    }
};

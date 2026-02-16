import { Resend } from 'resend';

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

const FROM_ADDRESS = 'Skyfynd <contact@skyfynd.io>';

interface EmailAttachment {
  filename: string;
  content: Uint8Array;
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
}

export async function sendEmail({ to, subject, html, text, replyTo, attachments }: SendEmailOptions) {
  const resend = getResend();

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
    replyTo,
    ...(attachments?.length ? {
      attachments: attachments.map(a => ({
        filename: a.filename,
        content: Buffer.from(a.content),
      })),
    } : {}),
  });

  if (error) {
    console.error('Resend email error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

import nodemailer from 'nodemailer';

const createTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const secure = (process.env.EMAIL_SECURE || 'false').toLowerCase() === 'true';
  const allowSelfSigned = (process.env.EMAIL_ALLOW_SELF_SIGNED || 'false').toLowerCase() === 'true';

  if (!host || !port || !user || !pass) {
    throw new Error('Email configuration is missing. Please set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS.');
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure,
    auth: { user, pass },
    // Optionally allow self-signed/intercepting certificates for dev networks
    tls: allowSelfSigned ? { rejectUnauthorized: false } : undefined
  });
};

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = createTransporter();
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html
  });
};

export default sendEmail;

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.privateemail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || process.env.GMAIL_USER || '',
    pass: process.env.SMTP_PASS || process.env.GMAIL_PASS || '',
  },
});

const FROM = process.env.EMAIL_FROM || 'NextForge Academy <noreply@nextforgeacademy.online>';

export async function sendWelcomeEmail(to: string, name: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Welcome to NextForge Academy! 🎓',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0d0f14;color:#f0f2f8;padding:32px;border-radius:16px">
        <h1 style="color:#6366f1">Welcome, ${name}!</h1>
        <p>You've successfully joined <strong>NextForge Academy</strong> — Africa's #1 tech learning platform.</p>
        <p>Start exploring 500+ courses and build your future in tech.</p>
        <a href="https://nextforgeacademy.online/courses" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:16px">Browse Courses</a>
        <p style="margin-top:32px;color:#6b7280;font-size:12px">NextForge Academy · nextforgeacademy.online</p>
      </div>
    `,
  });
}

export async function sendEnrollmentEmail(to: string, name: string, courseName: string, reference: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Enrollment Confirmed: ${courseName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0d0f14;color:#f0f2f8;padding:32px;border-radius:16px">
        <h1 style="color:#22c55e">You're Enrolled! 🎉</h1>
        <p>Hi ${name},</p>
        <p>Your enrollment in <strong>${courseName}</strong> is confirmed.</p>
        <p style="color:#6b7280;font-size:12px">Payment Reference: ${reference}</p>
        <a href="https://nextforgeacademy.online/dashboard" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:16px">Start Learning</a>
        <p style="margin-top:32px;color:#6b7280;font-size:12px">NextForge Academy · nextforgeacademy.online</p>
      </div>
    `,
  });
}

export async function sendCertificateEmail(to: string, name: string, courseName: string, certNumber: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Certificate Earned: ${courseName} 🏆`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0d0f14;color:#f0f2f8;padding:32px;border-radius:16px">
        <h1 style="color:#f59e0b">Congratulations, ${name}! 🏆</h1>
        <p>You have successfully completed <strong>${courseName}</strong>.</p>
        <p>Your certificate number: <strong style="color:#6366f1">${certNumber}</strong></p>
        <a href="https://nextforgeacademy.online/dashboard/certificates" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#f97316);color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:16px">View Certificate</a>
        <p style="margin-top:32px;color:#6b7280;font-size:12px">NextForge Academy · nextforgeacademy.online</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, name: string, resetUrl: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Reset Your Password — NextForge Academy',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0d0f14;color:#f0f2f8;padding:32px;border-radius:16px">
        <h1 style="color:#6366f1">Password Reset</h1>
        <p>Hi ${name},</p>
        <p>Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:16px">Reset Password</a>
        <p style="margin-top:16px;color:#6b7280;font-size:12px">If you didn't request this, ignore this email.</p>
        <p style="margin-top:32px;color:#6b7280;font-size:12px">NextForge Academy · nextforgeacademy.online</p>
      </div>
    `,
  });
}

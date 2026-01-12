import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

export async function sendOTPEmail(to: string, otp: string) {
  try {
    await mailer.sendMail({
      from: `"LiveClass" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Verify your LiveClass account",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #2563eb; text-align: center;">Email Verification</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #475569;">Hello,</p>
          <p style="font-size: 16px; line-height: 1.5; color: #475569;">Thank you for joining LiveClass! Your One-Time Password (OTP) for account verification is:</p>
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="font-size: 32px; color: #1e293b; margin: 0; letter-spacing: 4px;">${otp}</h1>
          </div>
          <p style="font-size: 14px; color: #64748b; text-align: center;">This code will expire in 10 minutes.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    });
    console.log(`OTP sent successfully to ${to}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    // In production, you might want to throw the error to handle it in the route
  }
}

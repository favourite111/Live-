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
  }
}

export async function sendStatusUpdateEmail(to: string, fullName: string, status: "active" | "suspended") {
  const isApproval = status === "active";
  const title = isApproval ? "Account Approved" : "Account Suspended";
  const color = isApproval ? "#22c55e" : "#ef4444";
  const message = isApproval 
    ? "Congratulations! Your account has been reviewed and approved. You can now log in and start using all the features of LiveClass."
    : "We regret to inform you that your account has been suspended. If you believe this is a mistake, please contact our support team.";

  try {
    await mailer.sendMail({
      from: `"LiveClass" <${process.env.EMAIL_USER}>`,
      to,
      subject: `LiveClass: ${title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: ${color}; text-align: center;">${title}</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #475569;">Hello ${fullName},</p>
          <p style="font-size: 16px; line-height: 1.5; color: #475569;">${message}</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://${process.env.REPLIT_DEV_DOMAIN}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Go to LiveClass</a>
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">LiveClass Educational Platform</p>
        </div>
      `,
    });
    console.log(`Status update email sent to ${to}`);
  } catch (error) {
    console.error("Error sending status update email:", error);
  }
}

export async function sendResetOTPEmail(to: string, otp: string) {
  try {
    await mailer.sendMail({
      from: `"LiveClass" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Reset your LiveClass password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #2563eb; text-align: center;">Password Reset</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #475569;">You requested to reset your password. Use the following code to complete the process:</p>
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="font-size: 32px; color: #1e293b; margin: 0; letter-spacing: 4px;">${otp}</h1>
          </div>
          <p style="font-size: 14px; color: #64748b; text-align: center;">This code will expire in 10 minutes.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });
    console.log(`Reset OTP sent to ${to}`);
  } catch (error) {
    console.error("Error sending reset OTP email:", error);
  }
}

export async function sendClassConfirmationEmail(to: string, fullName: string, classDetails: {
  title: string;
  description: string;
  startTime: string;
  durationMinutes: number;
  meetingLink: string;
}) {
  try {
    await mailer.sendMail({
      from: `"LiveClass" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Class Scheduled: ${classDetails.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #2563eb; text-align: center;">Class Confirmation</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #475569;">Hello ${fullName},</p>
          <p style="font-size: 16px; line-height: 1.5; color: #475569;">Your class has been successfully scheduled. Here are the details:</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Title:</strong> ${classDetails.title}</p>
            <p style="margin: 0 0 10px 0;"><strong>Time:</strong> ${classDetails.startTime}</p>
            <p style="margin: 0 0 10px 0;"><strong>Duration:</strong> ${classDetails.durationMinutes} minutes</p>
            <p style="margin: 0;"><strong>Meeting Link:</strong> <a href="${classDetails.meetingLink}">${classDetails.meetingLink}</a></p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://${process.env.REPLIT_DEV_DOMAIN}/dashboard" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View in Dashboard</a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">LiveClass Educational Platform</p>
        </div>
      `,
    });
    console.log(`Class confirmation email sent to ${to}`);
  } catch (error) {
    console.error("Error sending class confirmation email:", error);
  }
}

import sgMail from '@sendgrid/mail';
import { request } from 'express';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendResetPasswordEmail =  async(user, resetToken)=>{
    const resetUrl = `http://localhost:6000/api/auth/reset-password/${resetToken}`;//Change to your frontend URL in production!
    //const url = `${request.protocol}://${request.get('host')}:${process.env.PORT}/reset-password/${resetToken}`; // Alternative dynamic URL construction

    const msg = {
        to: user.email,
        from: process.env.FROM_EMAIL,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Click this link to reset: ${resetUrl}\nLink expires in 1 hour.`,

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hello ${user.name || 'there'},</p>
        <p>You (or someone else) requested to reset your password.</p>
        <p>Click the button below to set a new password:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
          Reset Password
        </a>
        <p>If you didn't request this, ignore this email — your password remains unchanged.</p>
        <p>This link expires in <strong>1 hour</strong> for security.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <small>© ${new Date().getFullYear()} Your App — Enugu, Nigeria</small>
      </div>
    `,

    };

    try {
        await sgMail.send(msg);
        console.log('Password reset email sent to:', user.email, `ResetToken: ${resetToken}`);
    } catch (error) {
        console.error('SendGrid reset email error:', error?.response?.body || error);
        throw new Error('Failed to send password reset email');
    }
};

export {sendResetPasswordEmail};
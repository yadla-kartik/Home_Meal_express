const { sendEmail } = require('./mailer')

const escapeHtml = (value) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const buildAdminOnboardingEmail = ({ name, email, adminCode, otp }) => {
  const safeName = escapeHtml(name || 'Admin')
  const safeEmail = escapeHtml(email)
  const safeAdminCode = escapeHtml(adminCode)
  const safeOtp = escapeHtml(otp)

  return {
    email,
    subject: 'Your Home Meal Express admin access is ready',
    text: [
      `Hi ${name || 'Admin'},`,
      '',
      'Welcome to Home Meal Express.',
      `Admin Code: ${adminCode}`,
      `Login Email: ${email}`,
      `One-Time Password: ${otp}`,
      '',
      'Use this one-time password to log in to the admin panel.',
      'After your first login, you will be asked to set a new password before continuing.',
      '',
      'Regards,',
      'Home Meal Express',
    ].join('\n'),
    html: `
      <div style="margin:0;padding:32px 16px;background:#fff7ed;font-family:Segoe UI,Arial,sans-serif;color:#1f2937;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:28px;overflow:hidden;box-shadow:0 18px 50px rgba(249,115,22,0.12);border:1px solid rgba(249,115,22,0.12);">
          <div style="padding:28px 32px;background:linear-gradient(135deg,#f97316,#fb923c);color:#ffffff;">
            <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.18em;font-weight:800;text-transform:uppercase;opacity:0.9;">Home Meal Express</p>
            <h1 style="margin:0;font-size:30px;line-height:1.1;font-weight:800;">Admin Access Activated</h1>
            <p style="margin:14px 0 0;font-size:14px;line-height:1.7;max-width:460px;color:rgba(255,255,255,0.9);">
              Your admin workspace is ready. Use the one-time password below to sign in securely for the first time.
            </p>
          </div>

          <div style="padding:32px;">
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;">Hi <strong>${safeName}</strong>,</p>
            <p style="margin:0 0 22px;font-size:15px;line-height:1.8;color:#4b5563;">
              You have been added as an admin for Home Meal Express. Please use the credentials below to access your dashboard.
            </p>

            <div style="border-radius:24px;background:linear-gradient(180deg,#fff7ed,#fffbf7);border:1px solid rgba(249,115,22,0.14);padding:24px;">
              <div style="display:grid;gap:14px;">
                <div>
                  <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.14em;font-weight:800;text-transform:uppercase;color:#f97316;">Login Email</p>
                  <p style="margin:0;font-size:16px;font-weight:700;color:#111827;">${safeEmail}</p>
                </div>
                <div>
                  <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.14em;font-weight:800;text-transform:uppercase;color:#f97316;">Admin Code</p>
                  <p style="margin:0;font-size:16px;font-weight:700;color:#111827;">${safeAdminCode}</p>
                </div>
                <div>
                  <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.14em;font-weight:800;text-transform:uppercase;color:#f97316;">One-Time Password</p>
                  <div style="display:inline-block;padding:14px 18px;border-radius:18px;background:#111827;color:#ffffff;font-size:30px;font-weight:900;letter-spacing:0.22em;">
                    ${safeOtp}
                  </div>
                </div>
              </div>
            </div>

            <div style="margin-top:22px;border-radius:20px;background:#f9fafb;border:1px solid #e5e7eb;padding:18px 20px;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:800;color:#111827;">What happens next?</p>
              <p style="margin:0;font-size:14px;line-height:1.7;color:#4b5563;">
                Log in with this one-time password, then create your own new password when prompted. After that, all future logins will use your new password.
              </p>
            </div>

            <p style="margin:24px 0 0;font-size:13px;line-height:1.7;color:#6b7280;">
              If you were not expecting this email, please contact the Home Meal Express super admin.
            </p>
          </div>
        </div>
      </div>
    `,
  }
}

const sendAdminOnboardingEmail = async (payload) => {
  const { email, subject, html, text } = buildAdminOnboardingEmail(payload)

  return sendEmail({
    to: email,
    subject,
    html,
    text,
  })
}

module.exports = {
  sendAdminOnboardingEmail,
}

const nodemailer = require('nodemailer')

const parseBool = (value) => String(value || '').toLowerCase() === 'true'

const resolveTransportConfig = () => {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const secure = parseBool(process.env.SMTP_SECURE)
  const user = process.env.SMTP_USER || process.env.MAIL_USER
  const pass = process.env.SMTP_PASS || process.env.MAIL_APP_PASSWORD

  if (host) {
    if (!user || !pass) {
      throw new Error('SMTP credentials missing. Set SMTP_USER and SMTP_PASS in backend/.env.')
    }

    return {
      host,
      port,
      secure,
      auth: { user, pass },
    }
  }

  if (user && pass) {
    return {
      service: 'gmail',
      auth: { user, pass },
    }
  }

  throw new Error(
    'Mail configuration missing. Set SMTP_HOST/SMTP_USER/SMTP_PASS or MAIL_USER/MAIL_APP_PASSWORD in backend/.env.',
  )
}

const getFromAddress = () => {
  const fromEmail =
    process.env.MAIL_FROM_EMAIL ||
    process.env.SMTP_FROM_EMAIL ||
    process.env.MAIL_USER ||
    process.env.SMTP_USER
  const fromName = process.env.MAIL_FROM_NAME || 'Home Meal Express'

  if (!fromEmail) {
    throw new Error('Sender email missing. Set MAIL_FROM_EMAIL or MAIL_USER in backend/.env.')
  }

  return `${fromName} <${fromEmail}>`
}

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = nodemailer.createTransport(resolveTransportConfig())

  return transporter.sendMail({
    from: getFromAddress(),
    to,
    subject,
    html,
    text,
  })
}

module.exports = {
  sendEmail,
}

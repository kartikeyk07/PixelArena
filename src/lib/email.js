import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({ to, subject, html }) {
  try {
    await resend.emails.send({
      from: "Zone Gaming <noreply@zone.com>",
      to,
      subject,
      html,
    })
  } catch (error) {
    console.error("Email error:", error)
  }
}
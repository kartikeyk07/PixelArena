import { sendEmail } from "@/lib/email"

export async function POST(req) {
  const { email, name } = await req.json()

  const html = `
    <h2>Welcome to Zone 🎮</h2>
    <p>Hello ${name},</p>
    <p>Your gaming account has been created successfully.</p>
    <p>Get ready to play!</p>
  `

  await sendEmail({
    to: email,
    subject: "Welcome to Zone",
    html,
  })

  return Response.json({ success: true })
}
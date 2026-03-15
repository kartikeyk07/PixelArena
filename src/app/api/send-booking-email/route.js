import { sendEmail } from "@/lib/email"

export async function POST(req) {

  const { email, game, slot, slots } = await req.json()
  const slotInfo = slots ? slots.join(", ") : slot

  const html = `
    <h2>Booking Confirmed 🎮</h2>

    <p>Your gaming session has been booked.</p>

    <p><strong>Game:</strong> ${game}</p>
    <p><strong>Slot:</strong> ${slotInfo}</p>

    <p>See you at the Zone!</p>
  `

  await sendEmail({
    to: email,
    subject: "Zone Booking Confirmation",
    html
  })

  return Response.json({ success: true })
}

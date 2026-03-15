"use client"

import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = momentLocalizer(moment)

export default function SlotCalendar({ bookings }) {

  const events = bookings.map(b => ({
    title: "Booked",
    start: new Date(b.start),
    end: new Date(b.end)
  }))

  return (
    <div className="bg-[#111] p-6 rounded-xl">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  )
}
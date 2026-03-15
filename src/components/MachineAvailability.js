"use client"

export default function MachineAvailability({ machines }) {

  return (
    <div className="grid grid-cols-3 gap-4">

      {machines.map(machine => (

        <div
          key={machine.id}
          className={`p-4 rounded-xl border
            ${machine.status === "available"
              ? "border-green-500"
              : "border-red-500"}
          `}
        >

          <p>{machine.gameType} #{machine.machineNumber}</p>

          <p className="text-sm">
            {machine.status === "available"
              ? "Available"
              : "Booked"}
          </p>

        </div>

      ))}

    </div>
  )
}
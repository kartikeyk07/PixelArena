"use client"

import { FaGamepad, FaClock, FaUsers } from "react-icons/fa"
import Card from "./Card"

export default function Cards({ zones }) {

  return (

    <div className="grid grid-cols-4 gap-6 mb-10">

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p>Total Zones</p>
            <h2 className="text-2xl">{zones.length}</h2>
          </div>
          <FaGamepad size={30}/>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p>Active Sessions</p>
            <h2 className="text-2xl">112</h2>
          </div>
          <FaUsers size={30}/>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p>Revenue Today</p>
            <h2 className="text-2xl">₹1250</h2>
          </div>
          <div className="text-2xl">₹</div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p>Peak Hours</p>
            <h2 className="text-2xl">6PM-10PM</h2>
          </div>
          <FaClock size={30}/>
        </div>
      </Card>

    </div>

  )
}
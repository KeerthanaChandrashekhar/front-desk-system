"use client"

import { Protected } from "@/components/protected"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock } from "lucide-react"

type DoctorStatus = "Available" | "Busy" | "Off Duty"

type Doctor = {
  id: string
  name: string
  specialty: string
  status: DoctorStatus
  nextAvailable: string
}

const doctorsSeed: Doctor[] = [
  { id: "1", name: "Dr. Smith", specialty: "General Practice", status: "Available", nextAvailable: "Now" },
  { id: "2", name: "Dr. Johnson", specialty: "Pediatrics", status: "Busy", nextAvailable: "2:30 PM" },
  { id: "3", name: "Dr. Lee", specialty: "Cardiology", status: "Off Duty", nextAvailable: "Tomorrow 9:00 AM" },
  { id: "4", name: "Dr. Patel", specialty: "Dermatology", status: "Available", nextAvailable: "Now" },
]

export default function DoctorsPage() {
  return (
    <Protected>
      <DoctorsScreen />
    </Protected>
  )
}

function statusBadge(status: DoctorStatus) {
  if (status === "Available") return <Badge className="bg-emerald-500/20 text-emerald-300">Available</Badge>
  if (status === "Busy") return <Badge className="bg-amber-500/20 text-amber-300">Busy</Badge>
  return <Badge className="bg-red-500/20 text-red-300">Off Duty</Badge>
}

function DoctorsScreen() {
  const [docs] = useState<Doctor[]>(doctorsSeed)

  return (
    <main className="min-h-[100dvh] w-full bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <h1 className="mb-4 text-xl font-semibold">Available Doctors</h1>

        <div className="space-y-3">
          {docs.map((d) => (
            <Card key={d.id} className="border-neutral-800 bg-neutral-900/60">
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-neutral-800 text-neutral-200">
                      {d.name
                        .split(" ")
                        .map((s) => s[0])
                        .join("")
                        .replace("Dr.", "D")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{d.name}</div>
                    <div className="text-sm text-neutral-400">{d.specialty}</div>
                  </div>
                </div>

                <div className="flex flex-1 items-center justify-end gap-4">
                  {statusBadge(d.status)}
                  <div className="flex items-center gap-1 text-sm text-neutral-400">
                    <Clock className="h-4 w-4" />
                    Next available: <span className="pl-1 text-neutral-300">{d.nextAvailable}</span>
                  </div>
                  <Button variant="secondary" className="border border-neutral-800 bg-neutral-900/70 text-neutral-200">
                    View Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}

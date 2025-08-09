"use client"

import { Protected } from "@/components/protected"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Clock, User, Search } from "lucide-react"

type PatientStatus = "Waiting" | "With Doctor" | "Done"
type Priority = "Normal" | "Urgent"

type Patient = {
  id: string
  name: string
  arrival: string // "09:30 AM"
  estWaitMin: number
  status: PatientStatus
  priority: Priority
  note?: string
}

const initialPatients: Patient[] = [
  { id: "1", name: "John Doe", arrival: "09:30 AM", estWaitMin: 15, status: "Waiting", priority: "Normal" },
  { id: "2", name: "Jane Smith", arrival: "09:45 AM", estWaitMin: 0, status: "With Doctor", priority: "Normal" },
  {
    id: "3",
    name: "Bob Johnson",
    arrival: "10:00 AM",
    estWaitMin: 5,
    status: "Waiting",
    priority: "Urgent",
    note: "Allergy",
  },
]

export default function QueuePage() {
  return (
    <Protected>
      <QueueScreen />
    </Protected>
  )
}

function QueueScreen() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients)
  const [filter, setFilter] = useState<"All" | PatientStatus>("All")
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    let list = patients
    if (filter !== "All") list = list.filter((p) => p.status === filter)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q))
    }
    return list
  }, [patients, filter, query])

  function updatePatient(id: string, patch: Partial<Patient>) {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }
  function removePatient(id: string) {
    setPatients((prev) => prev.filter((p) => p.id !== id))
  }
  function addPatient() {
    const n = patients.length + 1
    setPatients((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: `New Patient ${n}`,
        arrival: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        estWaitMin: Math.max(0, (n - 1) * 5),
        status: "Waiting",
        priority: "Normal",
      },
    ])
  }

  return (
    <main className="min-h-[100dvh] w-full bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <header className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-xl font-semibold">Queue Management</h1>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-400">Filter:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="h-9 rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-neutral-100 outline-none"
              >
                <option>All</option>
                <option>Waiting</option>
                <option>With Doctor</option>
                <option>Done</option>
              </select>
            </div>

            <div className="relative w-full sm:w-72">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search patients"
                className="w-full border-neutral-800 bg-neutral-900 pr-9 text-neutral-100 placeholder:text-neutral-500"
              />
              <Search className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            </div>
          </div>
        </header>

        <div className="space-y-3">
          {filtered.map((p, idx) => (
            <Card key={p.id} className="border-neutral-800 bg-neutral-900/60">
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-700 text-sm text-neutral-300">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{p.name}</span>
                      {p.priority === "Urgent" && (
                        <Badge variant="secondary" className="bg-red-500/15 text-red-300">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-sm text-neutral-400">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {p.status === "Waiting" ? "Waiting" : p.status === "With Doctor" ? "With Doctor" : "Done"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <User className="h-3.5 w-3.5" /> {p.priority === "Urgent" ? "High Priority" : "Normal Priority"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 items-center justify-end gap-3">
                  <div className="min-w-[150px] text-right text-sm text-neutral-400">
                    <div>Arrival: {p.arrival}</div>
                    <div>Est. Wait: {p.estWaitMin} min</div>
                  </div>

                  <select
                    value={p.status}
                    onChange={(e) => updatePatient(p.id, { status: e.target.value as PatientStatus })}
                    className="h-9 rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm"
                    aria-label="Status"
                  >
                    <option>Waiting</option>
                    <option>With Doctor</option>
                    <option>Done</option>
                  </select>

                  <select
                    value={p.priority}
                    onChange={(e) => updatePatient(p.id, { priority: e.target.value as Priority })}
                    className="h-9 rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm"
                    aria-label="Priority"
                  >
                    <option>Normal</option>
                    <option>Urgent</option>
                  </select>

                  <Button
                    variant="destructive"
                    onClick={() => removePatient(p.id)}
                    className="h-9 w-9 shrink-0 border border-red-900 bg-red-900/40 text-red-200 hover:bg-red-900/60"
                    aria-label={`Remove ${p.name}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-md border border-neutral-800 bg-neutral-900/60 p-6 text-center text-neutral-400">
              No patients found.
            </div>
          )}
        </div>

        <div className="mt-4">
          <Button onClick={addPatient} className="w-full">
            Add New Patient to Queue
          </Button>
        </div>
      </div>
    </main>
  )
}

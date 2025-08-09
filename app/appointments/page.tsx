"use client"

import { Protected } from "@/components/protected"
import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CalendarDays, ChevronLeft, ChevronRight, Search } from "lucide-react"

type ApptStatus = "Scheduled" | "Checked In" | "Completed" | "Cancelled"
type Appointment = {
  id: string
  patient: string
  doctor: string
  time: string // "10:30 AM"
  dateKey: string // "YYYY-MM-DD"
  status: ApptStatus
}

function ymd(d: Date) {
  return d.toISOString().slice(0, 10)
}

const seed: Appointment[] = [
  {
    id: "a1",
    patient: "John Doe",
    doctor: "Dr. Smith",
    time: "10:00 AM",
    dateKey: ymd(new Date()),
    status: "Scheduled",
  },
  {
    id: "a2",
    patient: "Jane Smith",
    doctor: "Dr. Johnson",
    time: "11:15 AM",
    dateKey: ymd(new Date()),
    status: "Checked In",
  },
  {
    id: "a3",
    patient: "Bob Johnson",
    doctor: "Dr. Lee",
    time: "2:30 PM",
    dateKey: ymd(new Date()),
    status: "Scheduled",
  },
]

export default function AppointmentsPage() {
  return (
    <Protected>
      <AppointmentsScreen />
    </Protected>
  )
}

function AppointmentsScreen() {
  const today = new Date()
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState<Date>(today)
  const [appts] = useState<Appointment[]>(seed)
  const [statusFilter, setStatusFilter] = useState<"All" | ApptStatus>("All")
  const [query, setQuery] = useState("")

  const days = useMemo(() => {
    const start = new Date(current)
    const end = new Date(current.getFullYear(), current.getMonth() + 1, 0)
    const firstWeekday = (start.getDay() + 7) % 7
    const totalDays = end.getDate()
    const grid: (Date | null)[] = []
    for (let i = 0; i < firstWeekday; i++) grid.push(null)
    for (let d = 1; d <= totalDays; d++) grid.push(new Date(current.getFullYear(), current.getMonth(), d))
    return grid
  }, [current])

  const list = useMemo(() => {
    const key = ymd(selected)
    let list = appts.filter((a) => a.dateKey === key)
    if (statusFilter !== "All") list = list.filter((a) => a.status === statusFilter)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((a) => a.patient.toLowerCase().includes(q))
    }
    return list
  }, [appts, selected, statusFilter, query])

  function prevMonth() {
    setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1))
  }
  function nextMonth() {
    setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1))
  }

  return (
    <main className="min-h-[100dvh] w-full bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <h1 className="mb-4 text-xl font-semibold">Appointment Management</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto_1fr] md:items-start">
          {/* Left controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-400">Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-9 rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm"
            >
              <option>All</option>
              <option>Scheduled</option>
              <option>Checked In</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>

          {/* Calendar */}
          <div className="flex flex-col items-center">
            <div className="mb-2 flex items-center gap-2">
              <Button
                variant="secondary"
                className="h-8 w-8 border border-neutral-800 bg-neutral-900/70 p-0 text-neutral-200"
                onClick={prevMonth}
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-[200px] text-center text-sm text-neutral-300">
                {current.toLocaleString(undefined, { month: "long", year: "numeric" })}
              </div>
              <Button
                variant="secondary"
                className="h-8 w-8 border border-neutral-800 bg-neutral-900/70 p-0 text-neutral-200"
                onClick={nextMonth}
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Card className="w-[310px] border-neutral-800 bg-neutral-900/60 p-3">
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-neutral-400">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>
              <div className="mt-1 grid grid-cols-7 gap-1">
                {days.map((d, i) =>
                  d ? (
                    <button
                      key={i}
                      onClick={() => setSelected(d)}
                      className={[
                        "h-9 rounded-md border text-sm",
                        "border-neutral-800 bg-neutral-950 text-neutral-200 hover:bg-neutral-900",
                        ymd(d) === ymd(selected) ? "border-emerald-600 bg-emerald-600/20" : "",
                      ].join(" ")}
                    >
                      {d.getDate()}
                    </button>
                  ) : (
                    <div key={i} />
                  ),
                )}
              </div>
            </Card>
          </div>

          {/* Right search */}
          <div className="relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patients"
              className="w-full border-neutral-800 bg-neutral-900 pr-9 text-neutral-100 placeholder:text-neutral-500"
            />
            <Search className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          </div>
        </div>

        {/* Appointments list */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center gap-2 text-neutral-300">
            <CalendarDays className="h-4 w-4" />
            <span className="text-sm">
              {selected.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            </span>
          </div>

          {list.length === 0 ? (
            <div className="rounded-md border border-neutral-800 bg-neutral-900/60 p-6 text-center text-neutral-400">
              No appointments for this date.
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((a) => (
                <Card key={a.id} className="border-neutral-800 bg-neutral-900/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-medium">{a.patient}</div>
                      <div className="text-sm text-neutral-400">{a.doctor}</div>
                    </div>
                    <div className="text-sm text-neutral-300">{a.time}</div>
                    <select
                      defaultValue={a.status}
                      className="h-9 rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm"
                      onChange={(e) => {
                        // demo: no persistence, just visual change
                        a.status = e.target.value as ApptStatus
                      }}
                    >
                      <option>Scheduled</option>
                      <option>Checked In</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

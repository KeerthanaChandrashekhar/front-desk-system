"use client"

import { useEffect, useMemo, useState } from "react"
import { Protected } from "@/components/protected"
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getDoctors,
  type Appointment,
  type Doctor,
} from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

export default function AppointmentsPage() {
  return (
    <Protected>
      <AppointmentsScreen />
    </Protected>
  )
}

function AppointmentsScreen() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<Appointment[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [statusFilter, setStatusFilter] = useState<"All" | Appointment["status"]>("All")
  const [query, setQuery] = useState("")

  // modal
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Appointment | null>(null)
  const [form, setForm] = useState<Omit<Appointment, "id">>({
    patientName: "",
    doctorId: "",
    date: "",
    time: "",
    status: "Scheduled",
  })

  async function load() {
    try {
      setLoading(true)
      setError(null)
      const [apps, docs] = await Promise.all([getAppointments(), getDoctors()])
      setRows(apps)
      setDoctors(docs)
    } catch (e: any) {
      setError(e.message || "Failed to load")
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
  }, [])

  const list = useMemo(() => {
    let list = rows
    if (statusFilter !== "All") list = list.filter((a) => a.status === statusFilter)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (a) => a.patientName.toLowerCase().includes(q) || (a.doctorName || "").toLowerCase().includes(q),
      )
    }
    return list
  }, [rows, statusFilter, query])

  function startCreate() {
    setEditing(null)
    setForm({ patientName: "", doctorId: "", date: "", time: "", status: "Scheduled" })
    setOpen(true)
  }
  function startEdit(a: Appointment) {
    setEditing(a)
    setForm({
      patientName: a.patientName,
      doctorId: a.doctorId,
      date: a.date,
      time: a.time,
      status: a.status,
    })
    setOpen(true)
  }

  async function save() {
    if (!form.patientName || !form.doctorId || !form.date || !form.time) {
      toast(  "All fields are required." )
      return
    }
    try {
      if (editing) {
        await updateAppointment(editing.id, form)
        toast("Appointment updated" )
      } else {
        await createAppointment(form)
        toast( "Appointment created" )
      }
      setOpen(false)
      await load()
    } catch (e: any) {
      toast( "Save failed" )
    }
  }

  async function remove(id: string) {
    try {
      await deleteAppointment(id)
      await load()
    } catch (e: any) {
      toast("Delete failed" )
    }
  }

  return (
    <main className="min-h-[100dvh] bg-neutral-950">
      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-xl font-semibold">Appointments</h1>
            <p className="text-sm text-neutral-400">Book, edit, and manage appointments.</p>
          </div>
          <Button onClick={startCreate}>Book Appointment</Button>
        </div>

        {/* Filters */}
        <div className="mb-4 grid gap-3 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 md:grid-cols-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-400">Status:</span>
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
          <Input
            placeholder="Search patients or doctors"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-neutral-800 bg-neutral-950 placeholder:text-neutral-500"
          />
        </div>

        {/* List */}
        <div className="grid gap-3">
          {list.map((a) => (
            <Card key={a.id} className="border-neutral-800 bg-neutral-900/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{a.patientName}</div>
                  <div className="text-sm text-neutral-400">{a.doctorName}</div>
                </div>
                <div className="text-sm text-neutral-300">
                  {a.date} • {a.time}
                </div>
                <select
                  defaultValue={a.status}
                  onChange={(e) => updateAppointment(a.id, { status: e.target.value as Appointment["status"] })}
                  className="h-9 rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm"
                >
                  <option>Scheduled</option>
                  <option>Checked In</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    className="border-neutral-800 bg-neutral-900/70"
                    onClick={() => startEdit(a)}
                  >
                    Edit
                  </Button>
                  <Button variant="destructive" className="h-9 w-9" onClick={() => remove(a.id)} aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {!loading && list.length === 0 && (
          <div className="mt-3 rounded-md border border-neutral-800 bg-neutral-900/60 p-6 text-center text-neutral-400">
            No appointments found.
          </div>
        )}
        {loading && <p className="mt-3 text-sm text-neutral-400">Loading...</p>}
        {error && <p className="mt-2 text-sm text-red-300">{error}</p>}

        {/* Modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg border-neutral-800 bg-neutral-900">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Appointment" : "Book Appointment"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <div>
                <label className="mb-1 block text-sm">Patient Name</label>
                <Input value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm">Doctor</label>
                <Select value={form.doctorId} onValueChange={(v) => setForm({ ...form, doctorId: v })}>
                  <SelectTrigger className="bg-neutral-950">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name} {d.specialization ? `— ${d.specialization}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm">Date</label>
                  <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm">Time</label>
                  <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm">Status</label>
                <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                  <SelectTrigger className="bg-neutral-950">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Checked In">Checked In</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={save}>{editing ? "Update" : "Create"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </main>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import { Protected } from "@/components/protected"
import {
  getDoctors,
  getQueue,
  createQueue,
  updateQueueStatus,
  deleteQueueEntry,
  type QueueEntry,
  type Doctor,
} from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { X, Search } from "lucide-react"

export default function QueuePage() {
  return (
    <Protected>
      <QueueScreen />
    </Protected>
  )
}

function QueueScreen() {

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<QueueEntry[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [filter, setFilter] = useState<"All" | QueueEntry["status"]>("All")
  const [q, setQ] = useState("")

  // Add form
  const [open, setOpen] = useState(false)
  const [patientName, setPatientName] = useState("")
  const [doctorId, setDoctorId] = useState<string>("")
  const [priority, setPriority] = useState<"Normal" | "Urgent">("Normal")

  // async function load() {
  //   try {
  //     setLoading(true)
  //     setError(null)
  //     const [queue, docs] = await Promise.all([getQueue(), getDoctors()])
  //     setRows(queue)
  //     setDoctors(docs)
  //   } catch (e: any) {
  //     setError(e.message || "Failed to load")
  //   } finally {
  //     setLoading(false)
  //   }
  // }
  // useEffect(() => {
  //   load()
  // }, [])

  const filtered = useMemo(() => {
    let list = rows
    if (filter !== "All") list = list.filter((x) => x.status === filter)
    if (q.trim()) {
      const s = q.toLowerCase()
      list = list.filter(
        (x) => x.patientName.toLowerCase().includes(s) || (x.doctorName || "").toLowerCase().includes(s),
      )
    }
    return list
  }, [rows, filter, q])

  async function addEntry() {
    if (!patientName || !doctorId) {
      toast( "Patient name and doctor are required." )
      return
    }
    try {
      await createQueue({ patientName, doctorId, priority })
      setOpen(false)
      setPatientName("")
      setDoctorId("")
      setPriority("Normal")
      // await load()
      toast( "Added to queue" )
    } catch (e: any) {
      toast( "Create failed")
    }
  }

  // async function updateStatus(id: string, status: QueueEntry["status"]) {
  //   try {
  //     await updateQueueStatus(id, status)
  //     // await load()
  //   } catch (e: any) {
  //     toast( "Update failed")
  //   }
  // }

  // async function remove(id: string) {
  //   try {
  //     await deleteQueueEntry(id)
  //     // await load()
  //   } catch (e: any) {
  //     toast( "Delete failed" )
  //   }
  // }

  return (
    <main className="min-h-[100dvh] bg-neutral-950 text-white">
      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <header className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-xl font-semibold">Queue Management</h1>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-400">Filter:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="h-9 rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm"
              >
                <option>All</option>
                <option>Waiting</option>
                <option>With Doctor</option>
                <option>Done</option>
              </select>
            </div>
            <div className="relative w-full sm:w-72">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search patients or doctors"
                className="w-full border-neutral-800 bg-neutral-900 pr-9 text-neutral-100 placeholder:text-neutral-500"
              />
              <Search className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Add Patient</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg border-neutral-800 bg-neutral-900">
                <DialogHeader>
                  <DialogTitle>Add Patient to Queue</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3">
                  <div>
                    <label className="mb-1 block text-sm">Patient Name</label>
                    <Input value={patientName} onChange={(e) => setPatientName(e.target.value)} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm">Doctor</label>
                    <Select value={doctorId} onValueChange={setDoctorId}>
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
                  <div>
                    <label className="mb-1 block text-sm">Priority</label>
                    <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                      <SelectTrigger className="bg-neutral-950">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={addEntry}>Add</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                    <div className="font-medium">{p.patientName}</div>
                    <div className="text-sm text-neutral-400">{p.doctorName}</div>
                  </div>
                </div>

                <div className="flex flex-1 items-center justify-end gap-3">
                  <select
                    value={p.status}
                    onChange={(e) => updateQueueStatus(p.id, e.target.value as QueueEntry["status"])}
                    className="h-9 rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm"
                  >
                    <option>Waiting</option>
                    <option>With Doctor</option>
                    <option>Done</option>
                  </select>
                  <Button
                    variant="destructive"
                    onClick={() => remove(p.id)}
                    className="h-9 w-9 shrink-0 border border-red-900 bg-red-900/40 text-red-200 hover:bg-red-900/60"
                    aria-label={`Remove ${p.patientName}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {!loading && filtered.length === 0 && (
            <div className="rounded-md border border-neutral-800 bg-neutral-900/60 p-6 text-center text-neutral-400">
              No queue entries found.
            </div>
          )}
        </div>

        {loading && <p className="mt-3 text-sm text-neutral-400">Loading...</p>}
        {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
      </section>
    </main>
  )
}

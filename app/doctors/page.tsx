"use client"

import { useEffect, useState } from "react"
import { Protected } from "@/components/protected"
import { getDoctors, createDoctor, updateDoctor, deleteDoctor, type Doctor } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

type DoctorForm = Omit<Doctor, "id">

export default function DoctorsPage() {
  return (
    <Protected>
      <DoctorsScreen />
    </Protected>
  )
}

function DoctorsScreen() {
  // 
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<Doctor[]>([])

  // filters
  const [specialization, setSpecialization] = useState("")
  const [location, setLocation] = useState("")
  const [availableFrom, setAvailableFrom] = useState("")
  const [availableTo, setAvailableTo] = useState("")
  const [refresh, setRefresh] = useState(0)

  // modal state
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Doctor | null>(null)
  const [form, setForm] = useState<DoctorForm>({
    name: "",
    specialization: "",
    location: "",
    availableFrom: "",
    availableTo: "",
  })

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await getDoctors({
          specialization: specialization || undefined,
          location: location || undefined,
          availableFrom: availableFrom || undefined,
          availableTo: availableTo || undefined,
        })
        if (active) setRows(data)
      } catch (e: any) {
        if (active) setError(e.message || "Failed to load")
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [specialization, location, availableFrom, availableTo, refresh])

  function resetForm(d?: Doctor | null) {
    if (d) {
      setForm({
        name: d.name,
        specialization: d.specialization,
        location: d.location || "",
        availableFrom: d.availableFrom || "",
        availableTo: d.availableTo || "",
      })
    } else {
      setForm({ name: "", specialization: "", location: "", availableFrom: "", availableTo: "" })
    }
  }

  async function save() {
    if (!form.name || !form.specialization) {
      toast( "Name and specialization are required." )
      return
    }
    try {
      if (editing) {
        await updateDoctor(editing.id, form)
        toast("Doctor updated" )
      } else {
        await createDoctor(form)
        toast("Doctor added" )
      }
      setOpen(false)
      setEditing(null)
      setRefresh((x) => x + 1)
    } catch (e: any) {
      toast("Save failed")
    }
  }

  async function remove(id: string) {
    try {
      await deleteDoctor(id)
      toast( "Doctor removed" )
      setRefresh((x) => x + 1)
    } catch (e: any) {
      toast("Delete failed")
    }
  }

  const empty = !loading && rows.length === 0

  return (
    <main className="min-h-[100dvh] bg-neutral-950">
      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-xl font-semibold">Doctors</h1>
            <p className="text-sm text-neutral-400">Manage doctors and filter by availability.</p>
          </div>
          <Dialog
            open={open}
            onOpenChange={(o) => {
              setOpen(o)
              if (!o) {
                setEditing(null)
                resetForm(null)
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditing(null)
                  resetForm(null)
                }}
              >
                Add Doctor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg border-neutral-800 bg-neutral-900">
              <DialogHeader>
                <DialogTitle>{editing ? "Edit Doctor" : "Add Doctor"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="grid gap-1.5">
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label>Specialization</Label>
                  <Input
                    value={form.specialization}
                    onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label>Location</Label>
                  <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
                <div className="grid gap-1.5 md:grid-cols-2 md:gap-3">
                  <div>
                    <Label>Available From</Label>
                    <Input
                      placeholder="09:00"
                      value={form.availableFrom}
                      onChange={(e) => setForm({ ...form, availableFrom: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Available To</Label>
                    <Input
                      placeholder="17:00"
                      value={form.availableTo}
                      onChange={(e) => setForm({ ...form, availableTo: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={save}>{editing ? "Update" : "Create"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="mb-4 grid gap-3 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 md:grid-cols-4">
          <Input
            placeholder="Specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="border-neutral-800 bg-neutral-950 placeholder:text-neutral-500"
          />
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border-neutral-800 bg-neutral-950 placeholder:text-neutral-500"
          />
          <Input
            placeholder="Available From (HH:mm)"
            value={availableFrom}
            onChange={(e) => setAvailableFrom(e.target.value)}
            className="border-neutral-800 bg-neutral-950 placeholder:text-neutral-500"
          />
          <Input
            placeholder="Available To (HH:mm)"
            value={availableTo}
            onChange={(e) => setAvailableTo(e.target.value)}
            className="border-neutral-800 bg-neutral-950 placeholder:text-neutral-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Available</TableHead>
                <TableHead className="w-40 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell>{d.specialization}</TableCell>
                  <TableCell>{d.location || "-"}</TableCell>
                  <TableCell>{(d.availableFrom || "-") + " - " + (d.availableTo || "-")}</TableCell>
                  <TableCell className="text-right">
                    <Dialog
                      onOpenChange={(o) => {
                        if (!o) return
                        setEditing(d)
                        resetForm(d)
                        setOpen(true)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="secondary" className="mr-2 border-neutral-800 bg-neutral-900/70">
                          Edit
                        </Button>
                      </DialogTrigger>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="border-neutral-800 bg-neutral-900">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete {d.name}?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => remove(d.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}

              {empty && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-neutral-400">
                    No doctors found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {loading && <p className="mt-3 text-sm text-neutral-400">Loading...</p>}
        {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
      </section>
    </main>
  )
}

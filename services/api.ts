export const API_BASE_URL = "http://localhost:3001"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("access_token")
}

type FetchOpts = RequestInit & {
  json?: any
  withAuth?: boolean
  searchParams?: Record<string, string | number | boolean | undefined | null>
}

function buildUrl(path: string, searchParams?: FetchOpts["searchParams"]) {
  const url = new URL(path.startsWith("http") ? path : `${API_BASE_URL}${path}`)
  if (searchParams) {
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v))
    })
  }
  return url.toString()
}

export async function apiFetch<T = any>(path: string, opts: FetchOpts = {}): Promise<T> {
  const { json, withAuth = true, searchParams, headers, ...rest } = opts
  const url = buildUrl(path, searchParams)
  const token = getToken()

  const res = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(withAuth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  })

  // Attempt JSON; if fails, throw text
  const text = await res.text()
  const data = text
    ? (() => {
        try {
          return JSON.parse(text)
        } catch {
          return text
        }
      })()
    : null
  if (!res.ok) {
    const message = (data as any)?.message || res.statusText
    throw new Error(typeof message === "string" ? message : "Request failed")
  }
  return data as T
}

// Auth
export async function loginRequest(username: string, password: string) {
  return apiFetch<{ access_token: string }>("/auth/login", {
    method: "POST",
    withAuth: false,
    json: { username, password },
  })
}

// Doctors
export type Doctor = {
  id: string
  name: string
  specialization: string
  location?: string
  availableFrom?: string
  availableTo?: string
}

export async function getDoctors(params?: {
  specialization?: string
  location?: string
  availableFrom?: string
  availableTo?: string
}) {
  return apiFetch<Doctor[]>("/doctor", { searchParams: params })
}

export async function createDoctor(payload: Omit<Doctor, "id">) {
  return apiFetch<Doctor>("/doctor", { method: "POST", json: payload })
}

export async function updateDoctor(id: string, payload: Partial<Omit<Doctor, "id">>) {
  return apiFetch<Doctor>(`/doctor/${id}`, { method: "PATCH", json: payload })
}

export async function deleteDoctor(id: string) {
  return apiFetch<void>(`/doctor/${id}`, { method: "DELETE" })
}

// Queue
export type QueueEntry = {
  id: string
  patientName: string
  doctorId: string
  doctorName?: string
  status: "Waiting" | "With Doctor" | "Done"
  arrivalTime?: string
  priority?: "Normal" | "Urgent"
}

export async function getQueue() {
  return apiFetch<QueueEntry[]>("/queue")
}

export async function createQueue(payload: {
  patientName: string
  doctorId: string
  status?: QueueEntry["status"]
  priority?: QueueEntry["priority"]
}) {
  return apiFetch<QueueEntry>("/queue", { method: "POST", json: payload })
}

export async function updateQueueStatus(id: string, status: QueueEntry["status"]) {
  return apiFetch<QueueEntry>(`/queue/${id}/status`, { method: "PATCH", json: { status } })
}

export async function deleteQueueEntry(id: string) {
  return apiFetch<void>(`/queue/${id}`, { method: "DELETE" })
}

// Appointments
export type Appointment = {
  id: string
  patientName: string
  doctorId: string
  doctorName?: string
  date: string // YYYY-MM-DD
  time: string // HH:mm or "10:30 AM" based on backend
  status: "Scheduled" | "Checked In" | "Completed" | "Cancelled"
}

export async function getAppointments() {
  return apiFetch<Appointment[]>("/appointment")
}

export async function createAppointment(payload: Omit<Appointment, "id">) {
  return apiFetch<Appointment>("/appointment", { method: "POST", json: payload })
}

export async function updateAppointment(id: string, payload: Partial<Omit<Appointment, "id">>) {
  return apiFetch<Appointment>(`/appointment/${id}`, { method: "PATCH", json: payload })
}

export async function deleteAppointment(id: string) {
  return apiFetch<void>(`/appointment/${id}`, { method: "DELETE" })
}

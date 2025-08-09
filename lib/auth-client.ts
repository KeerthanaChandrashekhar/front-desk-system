"use client"

import { getSupabaseBrowser, hasSupabase } from "./supabase-browser"

type Unsubscribe = () => void

const HAS_SUPABASE = hasSupabase()

// Demo auth (localStorage) for quick previews
const DEMO_KEY = "demo_authed"
const DEMO_EVENT = "demo-auth-change"

function getDemoAuthed() {
  try {
    return typeof window !== "undefined" && localStorage.getItem(DEMO_KEY) === "1"
  } catch {
    return false
  }
}
function setDemoAuthed(v: boolean) {
  try {
    if (v) localStorage.setItem(DEMO_KEY, "1")
    else localStorage.removeItem(DEMO_KEY)
    window.dispatchEvent(new Event(DEMO_EVENT))
  } catch {}
}

const demoAuth = {
  async getSession() {
    const authed = getDemoAuthed()
    return { session: authed ? { user: { id: "demo-user", email: "demo@example.com" } } : null }
  },
  async signInWithPassword(_: { email: string; password: string }) {
    setDemoAuthed(true)
    return { session: { user: { id: "demo-user", email: "demo@example.com" } } }
  },
  async signOut() {
    setDemoAuthed(false)
  },
  onAuthStateChange(cb: (authed: boolean) => void): Unsubscribe {
    const handler = () => cb(getDemoAuthed())
    window.addEventListener(DEMO_EVENT, handler)
    window.addEventListener("storage", handler)
    return () => {
      window.removeEventListener(DEMO_EVENT, handler)
      window.removeEventListener("storage", handler)
    }
  },
}

// Supabase-backed auth; client is created lazily inside each call
const supabaseAuth = {
  async getSession() {
    const supabase = getSupabaseBrowser()
    const { data } = await supabase.auth.getSession()
    return { session: data.session }
  },
  async signInWithPassword(args: { email: string; password: string }) {
    const supabase = getSupabaseBrowser()
    const { data, error } = await supabase.auth.signInWithPassword(args)
    if (error) return { session: null }
    return { session: data.session }
  },
  async signOut() {
    const supabase = getSupabaseBrowser()
    await supabase.auth.signOut()
  },
  onAuthStateChange(cb: (authed: boolean) => void): Unsubscribe {
    const supabase = getSupabaseBrowser()
    const { data } = supabase.auth.onAuthStateChange((_e, session) => cb(!!session))
    return () => data.subscription?.unsubscribe()
  },
}

export const auth = HAS_SUPABASE ? supabaseAuth : demoAuth
export const usingSupabase = HAS_SUPABASE

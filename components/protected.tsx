"use client"

import { type ReactNode, useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { auth } from "@/lib/auth-client"

export function Protected({ children }: { children?: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState<boolean>(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    let mounted = true
    auth.getSession().then(({ session }) => {
      if (!mounted) return
      const has = !!session
      setAuthed(has)
      setLoading(false)
      if (!has) {
        const next = encodeURIComponent(pathname || "/")
        router.replace(`/login?next=${next}`)
      }
    })
    const unsub = auth.onAuthStateChange((has) => {
      setAuthed(has)
      if (!has) {
        const next = encodeURIComponent(pathname || "/")
        router.replace(`/login?next=${next}`)
      }
    })
    return () => {
      mounted = false
      unsub?.()
    }
  }, [pathname, router])

  if (loading) return <div className="p-6 text-neutral-400">{"Loading…"}</div>
  if (!authed) return null
  return <>{children ?? null}</>
}

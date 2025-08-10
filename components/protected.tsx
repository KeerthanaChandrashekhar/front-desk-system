"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated, onAuthChange } from "@/lib/auth"

export function Protected({ children }: { children?: ReactNode }) {
  const [ready, setReady] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const authed = isAuthenticated()
    if (!authed) {
      const next = encodeURIComponent(pathname || "/dashboard")
      router.replace(`/login?next=${next}`)
    } else {
      setReady(true)
    }
    const unsub = onAuthChange((has) => {
      if (!has) router.replace("/login")
    })
    return () => unsub()
  }, [pathname, router])

  if (!ready) return null
  return <>{children}</>
}

"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Home, ListChecks, Stethoscope, CalendarClock, LogIn, LogOut } from "lucide-react"
import { clearToken, isAuthenticated, onAuthChange } from "@/lib/auth"

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/queue", label: "Queue", icon: ListChecks },
  { href: "/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/appointments", label: "Appointments", icon: CalendarClock },
]

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    setAuthed(isAuthenticated())
    const unsub = onAuthChange(setAuthed)
    return () => unsub()
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-neutral-100">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-neutral-800">HC</span>
          Health Console
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {nav.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-neutral-300 transition",
                  "hover:bg-neutral-900 hover:text-neutral-100",
                  active && "bg-neutral-900 text-neutral-100",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-4 w-4 text-neutral-100" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          {authed ? (
            <Button
              size="sm"
              variant="secondary"
              className="border border-neutral-800 bg-neutral-900/70 text-neutral-200"
              onClick={() => {
                clearToken()
                router.push("/login")
              }}
            >
              <LogOut className="mr-1 h-4 w-4 text-neutral-100" />
              Logout
            </Button>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              className="border border-neutral-800 bg-neutral-900/70 text-neutral-200"
              asChild
            >
              <Link href="/login">
                <LogIn className="mr-1 h-4 w-4 text-neutral-100" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

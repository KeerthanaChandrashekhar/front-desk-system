"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Stethoscope, CalendarClock, ListChecks, Home, LogOut, LogIn } from "lucide-react"
import { useEffect, useState } from "react"
import { auth } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

const nav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/queue", label: "Queue", icon: ListChecks },
  { href: "/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/appointments", label: "Appointments", icon: CalendarClock },
]

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    auth.getSession().then(({ session }) => setAuthed(!!session))
    const unsub = auth.onAuthStateChange((has) => setAuthed(has))
    return () => unsub?.()
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-neutral-100">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-neutral-800">HC</span>
          Health Console
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto">
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
              className="bg-neutral-900/70 border border-neutral-800 text-neutral-200"
              onClick={async () => {
                await auth.signOut()
                router.replace("/login")
              }}
            >
              <LogOut className="mr-1 h-4 w-4 text-neutral-100" />
              Logout
            </Button>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              asChild
              className="bg-neutral-900/70 border border-neutral-800 text-neutral-200"
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

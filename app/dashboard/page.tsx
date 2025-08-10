"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Protected } from "@/components/protected"
import { CalendarClock, ListChecks, Stethoscope, ArrowRight } from "lucide-react"

export default function DashboardPage() {
  return (
    <Protected>
      <main className="min-h-[100dvh] bg-neutral-950">
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          <h1 className="text-2xl font-semibold">Welcome</h1>
          <p className="mt-1 text-neutral-400">Choose a module to manage the clinic operations.</p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Link href="/queue" className="group">
              <Card className="h-full border-neutral-800 bg-neutral-900/60 transition group-hover:bg-neutral-900">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ListChecks className="h-5 w-5 text-neutral-300" />
                    Queue
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-neutral-400">Manage patient queue and update statuses.</CardContent>
              </Card>
            </Link>

            <Link href="/doctors" className="group">
              <Card className="h-full border-neutral-800 bg-neutral-900/60 transition group-hover:bg-neutral-900">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Stethoscope className="h-5 w-5 text-neutral-300" />
                    Doctors
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-neutral-400">
                  Add, edit, and remove doctors. Filter by availability.
                </CardContent>
              </Card>
            </Link>

            <Link href="/appointments" className="group">
              <Card className="h-full border-neutral-800 bg-neutral-900/60 transition group-hover:bg-neutral-900">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CalendarClock className="h-5 w-5 text-neutral-300" />
                    Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-neutral-400">Create and manage appointments for patients.</CardContent>
              </Card>
            </Link>
          </div>

          <div className="mt-8">
            <Button asChild className="gap-2">
              <Link href="/appointments">
                Go to Appointments
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </Protected>
  )
}

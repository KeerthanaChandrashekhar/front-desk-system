"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Stethoscope, CalendarClock, ListChecks, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-[100dvh] w-full bg-neutral-950 text-neutral-100">
      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Streamlined clinic operations in one place
          </h1>
          <p className="mt-4 text-neutral-400">
            Manage patient queues, doctor availability, and appointments with a cohesive, fast interface.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild className="gap-2">
              <Link href="/queue">
                Go to Queue
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="secondary"
              asChild
              className="gap-2 bg-neutral-900/70 border border-neutral-800 text-neutral-200"
            >
              <Link href="/appointments">
                View Appointments
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Link href="/queue" className="group">
            <Card className="h-full border-neutral-800 bg-neutral-900/60 transition group-hover:bg-neutral-900">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ListChecks className="h-5 w-5 text-neutral-300" />
                  Queue Management
                </CardTitle>
              </CardHeader>
              <CardContent className="text-neutral-400">
                Track patient positions, update statuses and priorities, and add or remove entries.
              </CardContent>
            </Card>
          </Link>

          <Link href="/doctors" className="group">
            <Card className="h-full border-neutral-800 bg-neutral-900/60 transition group-hover:bg-neutral-900">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Stethoscope className="h-5 w-5 text-neutral-300" />
                  Available Doctors
                </CardTitle>
              </CardHeader>
              <CardContent className="text-neutral-400">
                See doctor status, next-available times, and open schedules for booking.
              </CardContent>
            </Card>
          </Link>

          <Link href="/appointments" className="group">
            <Card className="h-full border-neutral-800 bg-neutral-900/60 transition group-hover:bg-neutral-900">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarClock className="h-5 w-5 text-neutral-300" />
                  Appointment Management
                </CardTitle>
              </CardHeader>
              <CardContent className="text-neutral-400">
                Pick a date, filter by status, search patients, and create or update appointments.
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </main>
  )
}

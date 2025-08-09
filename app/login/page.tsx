"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Auth } from "@supabase/auth-ui-react"
import { getSupabaseBrowser } from "@/lib/supabase-browser"
import { auth, usingSupabase } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const customTheme = {
  default: {
    colors: {
      brand: "hsl(142 60% 45%)",
      brandAccent: "hsl(142 65% 35%)",
      brandButtonText: "white",
      inputBackground: "hsl(0 0% 6%)",
      inputBorder: "hsl(0 0% 20%)",
      inputText: "hsl(0 0% 96%)",
      messageText: "hsl(0 0% 90%)",
      defaultButtonBackground: "hsl(0 0% 12%)",
      defaultButtonBackgroundHover: "hsl(0 0% 16%)",
      defaultButtonBorder: "hsl(0 0% 22%)",
    },
    radii: { borderRadiusButton: "8px", buttonBorderRadius: "8px", inputBorderRadius: "8px" },
  },
} as const

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get("next") || "/queue"

  useEffect(() => {
    auth.getSession().then(({ session }) => {
      if (session) router.replace(next)
    })
  }, [next, router])

  const [email, setEmail] = useState("demo@example.com")
  const [password, setPassword] = useState("password")

  return (
    <main className="min-h-[100dvh] bg-neutral-950 text-neutral-100">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-10 md:py-16">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-1 text-neutral-400">Front desk access to Queue, Doctors, and Appointments.</p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          {usingSupabase ? (
            <Auth
              supabaseClient={getSupabaseBrowser()}
              view="sign_in"
              theme="default"
              appearance={{
                theme: customTheme,
                extend: true,
                className: {
                  container: "text-neutral-100",
                  input: "bg-neutral-950 border-neutral-800 text-neutral-100 placeholder:text-neutral-500",
                  label: "text-neutral-300",
                  anchor: "text-emerald-300 hover:text-emerald-200",
                  button: "bg-neutral-950 border-neutral-800 text-neutral-100",
                  message: "text-neutral-200",
                },
              }}
              providers={[]}
            />
          ) : (
            <form
              className="grid gap-4"
              onSubmit={async (e) => {
                e.preventDefault()
                const { session } = await auth.signInWithPassword({ email, password })
                if (session) router.replace(next)
              }}
            >
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-neutral-950 border-neutral-800 text-neutral-100 placeholder:text-neutral-500"
                  placeholder="you@clinic.com"
                  type="email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-neutral-950 border-neutral-800 text-neutral-100 placeholder:text-neutral-500"
                  placeholder="••••••••"
                  type="password"
                />
              </div>
              <Button type="submit" className="w-full">
                Sign in (Demo)
              </Button>
              <p className="text-xs text-neutral-500">
                Demo mode is active. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to use real auth.
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}

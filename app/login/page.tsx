"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { loginRequest } from "@/services/api"
import { setToken } from "@/lib/auth"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get("next") || "/dashboard"


  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!username || !password) {
      toast( "Missing credentials" )
      return
    }
    try {
      console.log("submitting form ")
      setLoading(true)
      const res = await loginRequest(username, password)
      setToken(res.access_token)
      router.replace(next)
    } catch (err: any) {
      toast( "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-[100dvh] place-items-center bg-neutral-950 px-4">
      <Card className="w-full max-w-md border-neutral-800 bg-neutral-900/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl">Front Desk Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="frontdesk"
                className="border-neutral-800 bg-neutral-950 text-neutral-100 placeholder:text-neutral-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border-neutral-800 bg-neutral-950 text-neutral-100 placeholder:text-neutral-500"
              />
            </div>
            <Button type="submit" disabled={loading} className="mt-2">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

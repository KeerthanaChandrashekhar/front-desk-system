import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "Health Console",
  description: "Clinic Front Desk System",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html { font-family: ${GeistSans.style.fontFamily}; --font-sans: ${GeistSans.variable}; --font-mono: ${GeistMono.variable}; }
        `}</style>
      </head>
      <body className="min-h-screen bg-neutral-950 text-neutral-100">
        <SiteHeader />
         <Toaster />
        {children}
      </body>
    </html>
  )
}

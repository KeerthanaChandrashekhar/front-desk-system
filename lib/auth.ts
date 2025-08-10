"use client"

// Simple JWT auth helpers using localStorage

export const TOKEN_KEY = "access_token"

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
  window.dispatchEvent(new Event("auth:update"))
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  window.dispatchEvent(new Event("auth:update"))
}

export function isAuthenticated() {
  return !!getToken()
}

export function onAuthChange(cb: (authed: boolean) => void) {
  const handler = () => cb(isAuthenticated())
  window.addEventListener("auth:update", handler)
  window.addEventListener("storage", handler)
  return () => {
    window.removeEventListener("auth:update", handler)
    window.removeEventListener("storage", handler)
  }
}

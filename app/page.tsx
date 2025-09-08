"use client"

import { useEffect, useState } from "react"
import { LoginForm } from "@/components/login-form"
import { Dashboard } from "@/components/dashboard"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const accessToken = localStorage.getItem("accessToken")
    if (accessToken) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (accessToken: string) => {
    localStorage.setItem("accessToken", accessToken)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <main>{isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <LoginForm onLogin={handleLogin} />}</main>
}

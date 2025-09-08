"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    if (accessToken) {
      router.push("/admin")
    }
  }, [router])

  const handleLogin = (accessToken: string) => {
    localStorage.setItem("accessToken", accessToken)
    router.push("/admin")
  }

  return <LoginForm onLogin={handleLogin} />
}

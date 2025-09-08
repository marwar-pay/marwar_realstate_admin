"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Eye, EyeOff, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import { apiPost } from "@/lib/axiosInstance"
import Image from "next/image"

interface LoginFormProps {
  onLogin: (accessToken: string) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [userNameOrEmail, setUserNameOrEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await apiPost("api/auth/login", {
        userNameOrEmail,
        password,
      })

      const { accessToken, refreshToken, userName } = response.data.data
      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("refreshToken", refreshToken)

      toast({
        title: "Login Successful",
        description: `Welcome, ${userName}!`,
      })

      onLogin(accessToken)
    } catch (error: any) {
      const message = error.response?.data?.message || "Invalid credentials"
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Background Image (Mobile + Desktop) */}
      <div
        className="relative w-full md:w-1/2 h-60 md:h-auto bg-cover bg-center"
        style={{ backgroundImage: "url('/images/117.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/30 md:bg-transparent"></div>
        <div className="absolute bottom-6 left-6 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-lg shadow-lg max-w-xs">
          <p className="text-gray-800 dark:text-gray-200 font-semibold">
            Manage Properties Efficiently
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Easily track rent payments, maintenance requests & tenant communications in one place.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="relative flex w-full md:w-1/2 items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        {/* Card */}
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center">
           <div className="mx-auto w-16 h-16 flex items-center justify-center">
  <Image
    src="/images/logo.png"
    alt="Company Logo"
    width={64}
    height={64}
    className="rounded-2xl object-contain"
  />
</div>

            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Real Estate Admin
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Sign in to manage your properties
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userNameOrEmail">Username or Email</Label>
                <Input
                  id="userNameOrEmail"
                  type="text"
                  placeholder="Enter username or email"
                  value={userNameOrEmail}
                  onChange={(e) => setUserNameOrEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

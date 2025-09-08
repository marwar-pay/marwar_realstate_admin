"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { UserProvider } from "../context/UserContext"
import { CategoryProvider } from "../context/CategoryContext"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    router.push("/login")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <DashboardHeader onLogout={handleLogout} />
          <main className="p-6">
             <UserProvider>
          <CategoryProvider>{children}</CategoryProvider>
          </UserProvider></main>
        </div>
      </div>
    </SidebarProvider>
  )
}

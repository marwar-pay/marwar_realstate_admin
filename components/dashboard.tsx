"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { PropertiesTable } from "@/components/properties-table"

import { DashboardOverview } from "@/components/dashboard-overview"

import { CategoryManager } from "./categoryManager"
import { AddPropertyForm } from "./add-property-form"

interface DashboardProps {
  onLogout: () => void
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [activeView, setActiveView] = useState("overview")

  const renderContent = () => {
    switch (activeView) {
      case "overview":
        return <DashboardOverview />
      case "properties":
        return <PropertiesTable />
      case "add-property":
        return <AddPropertyForm />
         case "add-category":
        return <CategoryManager />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar activeView={activeView} setActiveView={setActiveView} />
        <div className="flex-1">
          <DashboardHeader onLogout={onLogout} />
          <main className="p-6">{renderContent()}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

"use client"

import * as React from "react"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { usePathname } from "next/navigation"
import { Home, Settings, Plus, BarChart3, User } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

const menuItems = [
  { title: "Overview", icon: BarChart3, href: "/admin" },
  { title: "Properties", icon: Home, href: "/admin/properties" },
  { title: "All Properties", icon: Home, href: "/admin/allproperties" },
  { title: "Add Property", icon: Plus, href: "/admin/add-property" },
  { title: "Sold Property", icon: Home, href: "/admin/sold" },
  { title: "UnSold Property", icon: Home, href: "/admin/unsold" },
  { title: "Add Category", icon: Settings, href: "/admin/add-category" },
  { title: "Profile", icon: User, href: "/admin/profile" },
  { title: "Users", icon: User, href: "/admin/users" },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          {/* Logo */}
          <div className="flex items-center justify-center py-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg"
            >
              <Image
                src="/images/logo.png"
                alt="Company Logo"
                width={40}
                height={40}
                className="rounded-lg object-contain"
              />
            </motion.div>
          </div>

          <SidebarGroupLabel />

          <SidebarMenu>
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <SidebarMenuItem key={item.href}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={item.href}>
                          <motion.div
                            whileHover={{ scale: 1.05, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <SidebarMenuButton
                              isActive={isActive}
                              className={`
                                w-full flex gap-2 items-center rounded-xl px-3 py-2 transition-all
                                ${isActive
                                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-800"}
                              `}
                            >
                              <item.icon
                                className={`w-5 h-5 shrink-0 ${
                                  isActive ? "text-white" : "text-gray-500"
                                }`}
                              />
                              <span className="group-data-[collapsible=icon]:hidden font-medium">
                                {item.title}
                              </span>
                            </SidebarMenuButton>
                          </motion.div>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

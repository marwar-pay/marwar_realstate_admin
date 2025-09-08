import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Building2, Home, Plus, Settings, BarChart3, User } from "lucide-react"

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
  
 <Sidebar>
       <SidebarHeader className="border-b">
         <div className="flex items-center gap-2 px-4 py-2">
           <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
             <Building2 className="w-5 h-5 text-white" />
           </div>
           <div>
             <h2 className="font-semibold text-lg">RealEstate</h2>
             <p className="text-xs text-muted-foreground">Admin Panel</p>
           </div>
         </div>
       </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} passHref>
                    <SidebarMenuButton isActive={pathname === item.href} className="w-full">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
         <div className="p-4 text-xs text-muted-foreground">© 2024 RealEstate Admin</div>
       </SidebarFooter>
    </Sidebar>
  )
}

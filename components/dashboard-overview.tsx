// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Building2, Home, TrendingUp, Users } from "lucide-react"
// import { apiGet } from "@/lib/axiosInstance"
// // import SalesChart from "./salesChart"


// export function DashboardOverview() {
//   const [stats, setStats] = useState({
//     totalProperties: 0,
//     totalUsers: 0,
//     totalRevenue: 0,
//     activeListings: 0,
//   })

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         // const token = localStorage.getItem("accessToken")
//         const response = await apiGet("api/properties");
//         const data = response.data;


//         setStats({
//           totalProperties: data.length || 0,
//           totalUsers: 150, // Mock data
//           totalRevenue: 2500000, // Mock data
//           activeListings: data.filter((p: any) => p.category === "Rent").length || 0,
//         })
//       } catch (error) {
//         console.error("Failed to fetch stats:", error)
//       }
//     }

//     fetchStats()
//   }, [])

//   const statCards = [
//     {
//       title: "Total Properties",
//       value: stats.totalProperties,
//       icon: Building2,
//       color: "text-blue-600",
//       bgColor: "bg-blue-100 dark:bg-blue-900/20",
//     },
//     {
//       title: "Active Listings",
//       value: stats.activeListings,
//       icon: Home,
//       color: "text-green-600",
//       bgColor: "bg-green-100 dark:bg-green-900/20",
//     },
//     {
//       title: "Total Users",
//       value: stats.totalUsers,
//       icon: Users,
//       color: "text-purple-600",
//       bgColor: "bg-purple-100 dark:bg-purple-900/20",
//     },
//     {
//       title: "Revenue",
//       value: `₹${stats.totalRevenue.toLocaleString()}`,
//       icon: TrendingUp,
//       color: "text-orange-600",
//       bgColor: "bg-orange-100 dark:bg-orange-900/20",
//     },
//   ]

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">Dashboard Overview</h1>
//         <p className="text-muted-foreground">Welcome back! Here's what's happening with your properties.</p>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//         {statCards.map((stat, index) => (
//           <Card key={index}>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
//               <div className={`p-2 rounded-lg ${stat.bgColor}`}>
//                 <stat.icon className={`h-4 w-4 ${stat.color}`} />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stat.value}</div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <div className="grid gap-6 md:grid-cols-2">
//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Activity</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
//                 <span className="text-sm">New property added: Luxurious Villa</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <div className="w-2 h-2 bg-green-600 rounded-full"></div>
//                 <span className="text-sm">Property sold: Modern Apartment</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
//                 <span className="text-sm">New user registered</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Property Types</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               <div className="flex justify-between">
//                 <span className="text-sm">Villa</span>
//                 <span className="text-sm font-medium">45%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm">Apartment</span>
//                 <span className="text-sm font-medium">35%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-green-600 h-2 rounded-full" style={{ width: "35%" }}></div>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm">House</span>
//                 <span className="text-sm font-medium">20%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-orange-600 h-2 rounded-full" style={{ width: "20%" }}></div>
//               </div>
//             </div>
//           </CardContent>
//           {/* <SalesChart/> */}
//         </Card>
//       </div>
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Home, TrendingUp, Users } from "lucide-react"
import { apiGet } from "@/lib/axiosInstance"

export function DashboardOverview() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activeListings: 0,
  })
  const [recentActivity, setRecentActivity] = useState<string[]>([])
  const [propertyTypes, setPropertyTypes] = useState<{type: string, count: number}[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch admin data in parallel
        const [
          propertiesResponse, 
          usersResponse,
          soldPropertiesResponse,
          unsoldResponse
        ] = await Promise.all([
          apiGet("/api/admin/properties"),
          apiGet("/api/admin/users"),
          apiGet("/api/admin/properties/sold"),
          apiGet("/api/admin/properties/unsold")
        ]);

        // Calculate total revenue from sold properties
        const totalRevenue = soldPropertiesResponse.data.reduce(
          (sum: number, property: any) => sum + property.price, 0
        );

        // Calculate property type distribution
        const propertyTypeCounts: Record<string, number> = {};
        propertiesResponse.data.forEach((property: any) => {
          const type = property.propertyType;
          propertyTypeCounts[type] = (propertyTypeCounts[type] || 0) + 1;
        });
        
        const propertyTypesArray = Object.entries(propertyTypeCounts)
          .map(([type, count]) => ({ type, count }))
          .sort((a, b) => b.count - a.count);

        // Get recent activity (last 3 sold properties)
        const recentSold = soldPropertiesResponse.data
          .slice(0, 3)
          .map((property: any) => `Property sold: ${property.title}`);

        setStats({
          totalProperties: propertiesResponse.data.length || 0,
          totalUsers: usersResponse.data.length || 0,
          totalRevenue,
          activeListings: unsoldResponse.data.length || 0,
        });
        
        setPropertyTypes(propertyTypesArray);
        setRecentActivity([
          ...recentSold,
          `New users registered: ${usersResponse.data.length}`
        ]);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Properties",
      value: stats.totalProperties,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Active Listings",
      value: stats.activeListings,
      icon: Home,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ]

  // Calculate percentages for property types
  const totalProperties = stats.totalProperties || 1; // Prevent division by zero
  const propertyTypePercentages = propertyTypes.map(pt => ({
    ...pt,
    percentage: Math.round((pt.count / totalProperties) * 100)
  }));

  // Colors for property type bars
  const barColors = ["bg-blue-600", "bg-green-600", "bg-orange-600", "bg-purple-600"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your properties.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-2 h-2 ${barColors[index] || "bg-blue-600"} rounded-full`}></div>
                  <span className="text-sm">{activity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Property Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {propertyTypePercentages.slice(0, 3).map((pt, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm capitalize">{pt.type}</span>
                    <span className="text-sm font-medium">{pt.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${barColors[index]}`} 
                      style={{ width: `${pt.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
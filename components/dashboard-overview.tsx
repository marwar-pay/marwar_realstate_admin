
// "use client"

// import { useEffect, useState } from "react"
// import { motion } from "framer-motion"
// import Image from "next/image"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { apiGet } from "@/lib/axiosInstance"

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
//         const response = await apiGet("api/properties")
//         const data = response.data

//         setStats({
//           totalProperties: data.length || 0,
//           totalUsers: 150,
//           totalRevenue: 2532100,
//           activeListings: data.filter((p: any) => p.category === "Rent").length || 0,
//         })
//       } catch (error) {
//         console.error("Failed to fetch stats:", error)
//       }
//     }

//     fetchStats()
//   }, [])

//   return (
//     <div className="relative min-h-screen p-6 space-y-10">
//       {/* Full background image */}
//       <Image
//         src="/images/117.jpg"
//         alt="Property Background"
//         fill
//         priority
//         className="object-cover -z-20"
//       />

//       {/* Overlay layer */}
//       <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/90 dark:from-black/70 dark:via-black/60 dark:to-black/90 -z-10" />

//       {/* Content */}
//       <div className="relative p-6 space-y-8">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-center"
//         >
//           <h1 className="text-4xl font-bold">Dashboard Overview</h1>
//           <p className="text-muted-foreground">
//             Welcome back! Here's what's happening with your properties.
//           </p>
//         </motion.div>

//         {/* Hero Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
//           {/* Left Stat Card */}
//           <GlassCard title="Average Orders">
//             <p className="text-3xl font-bold">₹4,25,556</p>
//           </GlassCard>

//           {/* Center Image with Overlay */}
//           <div className="relative h-[300px] w-full rounded-2xl overflow-hidden shadow-2xl">
//             <Image
//               src="/images/117.jpg"
//               alt="Featured Property"
//               fill
//               className="object-cover"
//             />

//             {/* Overlay Stats */}
//             <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg">
//               <p className="text-sm text-gray-600">Total Sales</p>
//               <h2 className="text-2xl font-bold">23,453.00</h2>
//             </div>
//             <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg">
//               <p className="text-sm text-gray-600">Number of Sales</p>
//               <h2 className="text-2xl font-bold">3,421</h2>
//             </div>
//             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg">
//               <p className="text-sm text-gray-600">Total Revenue</p>
//               <h2 className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</h2>
//             </div>
//           </div>

//           {/* Right Stat Card */}
//           <GlassCard title="Popular Property">
//             <p className="text-sm">Most popular property type:</p>
//             <p className="text-lg font-semibold text-blue-600">Apartment</p>
//             <p className="text-xs text-gray-500">35% Listings</p>
//           </GlassCard>
//         </div>

//         {/* Bottom Cards */}
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           <GlassCard title="Property Overview">
//             <BarChart label="House" value={50} color="bg-blue-600" />
//             <BarChart label="Apartment" value={30} color="bg-green-600" />
//             <BarChart label="Villa" value={20} color="bg-orange-600" />
//           </GlassCard>

//           <GlassCard title="Users">
//             <p className="text-3xl font-bold">{stats.totalUsers}</p>
//             <p className="text-sm text-gray-500">Active Users Registered</p>
//           </GlassCard>

//           <GlassCard title="Active Listings">
//             <p className="text-3xl font-bold">{stats.activeListings}</p>
//             <p className="text-sm text-gray-500">Currently Available Properties</p>
//           </GlassCard>
//         </div>
//       </div>
//     </div>
//   )
// }

// /* ----------------- Small Components ----------------- */
// function GlassCard({ title, children }: { title: string; children: React.ReactNode }) {
//   return (
//     <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
//       <Card className="rounded-2xl border border-white/20 bg-white/70 dark:bg-black/50 backdrop-blur-md shadow-xl h-full">
//         <CardHeader>
//           <CardTitle>{title}</CardTitle>
//         </CardHeader>
//         <CardContent>{children}</CardContent>
//       </Card>
//     </motion.div>
//   )
// }

// function BarChart({ label, value, color }: { label: string; value: number; color: string }) {
//   return (
//     <div className="mb-4">
//       <div className="flex justify-between text-sm">
//         <span>{label}</span>
//         <span className="font-medium">{value}%</span>
//       </div>
//       <div className="w-full bg-gray-200 rounded-full h-2">
//         <div className={`${color} h-2 rounded-full`} style={{ width: `${value}%` }}></div>
//       </div>
//     </div>
//   )
// }



"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiGet } from "@/lib/axiosInstance"


export function DashboardOverview() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activeListings: 0,
    propertyTypesCount: [] as { _id: string; count: number }[],
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiGet("api/admin/dashboard")
        const data = response.data.data

        setStats({
          totalProperties: data.totalProperties || 0,
          totalUsers: data.totalUsers || 0,
          totalRevenue: data.totalRevenue || 0,
          activeListings: data.activeListings || 0,
          propertyTypesCount: data.propertyTypesCount || [],
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="relative min-h-screen p-6 space-y-10">
      {/* Full background image */}
      <Image
        src="/images/117.jpg"
        alt="Property Background"
        fill
        priority
        className="object-cover -z-20"
      />

      {/* Overlay layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/90 dark:from-black/70 dark:via-black/60 dark:to-black/90 -z-10" />

      {/* Content */}
      <div className="relative p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your properties.
          </p>
        </motion.div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Left Stat Card */}
          <GlassCard title="Total Properties">
            <p className="text-3xl font-bold">{stats.totalProperties}</p>
          </GlassCard>

          {/* Center Image with Overlay */}
          <div className="relative h-[300px] w-full rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/117.jpg"
              alt="Featured Property"
              fill
              className="object-cover"
            />

            {/* Overlay Stats */}
            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg">
              <p className="text-sm text-gray-600">Total Sales</p>
              <h2 className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</h2>
            </div>
            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg">
              <p className="text-sm text-gray-600">Active Listings</p>
              <h2 className="text-2xl font-bold">{stats.activeListings}</h2>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg">
              <p className="text-sm text-gray-600">Users</p>
              <h2 className="text-2xl font-bold">{stats.totalUsers}</h2>
            </div>
          </div>

          {/* Right Stat Card */}
          <GlassCard title="Revenue">
            <p className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Revenue Generated</p>
          </GlassCard>
        </div>

        {/* Bottom Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <GlassCard title="Property Types">
            {stats.propertyTypesCount.map((type) => (
              <BarChart
                key={type._id}
                label={type._id}
                value={type.count}
                color={
                  type._id === "Apartment"
                    ? "bg-green-600"
                    : type._id === "Villa"
                    ? "bg-orange-600"
                    : "bg-blue-600"
                }
              />
            ))}
          </GlassCard>

          <GlassCard title="Users">
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
            <p className="text-sm text-gray-500">Active Users Registered</p>
          </GlassCard>

          <GlassCard title="Active Listings">
            <p className="text-3xl font-bold">{stats.activeListings}</p>
            <p className="text-sm text-gray-500">Currently Available Properties</p>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

/* ----------------- Small Components ----------------- */
function GlassCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
      <Card className="rounded-2xl border border-white/20 bg-white/70 dark:bg-black/50 backdrop-blur-md shadow-xl h-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  )
}

function BarChart({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${value * 25}%` }}></div>
      </div>
    </div>
  )
}

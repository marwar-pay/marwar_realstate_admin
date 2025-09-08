// app/dashboard/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHome, FaUsers, FaChartLine, FaCog, FaSignOutAlt, FaSearch, FaBell } from 'react-icons/fa';
import SummaryCard from '@/components/SummaryCard';
import PropertyTable from '@/components/PropertyTable';
import UserTable from '@/components/UserTable';
import RecentActivity from '@/components/RecentActivity';
import SalesChart from '@/components/SalesChart';
import Loader from '@/components/Loader';

// Define types based on API responses
interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: {
    state?: string;
    city?: string;
    address?: string;
    pincode?: number;
  };
  propertyType: string;
  listedBy?: {
    _id: string;
    fullName: string;
    email: string;
  } | string | null;
  soldTo?: string | null;
  isSold: boolean;
  isActive: boolean;
  createdAt: string;
  images: string[];
}

interface User {
  _id: string;
  userName: string;
  memberType: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  address?: {
    country?: string;
    state?: string;
    city?: string;
    area?: string;
    pincode?: number;
  };
  listedProperties?: string[];
  purchasedProperties?: string[];
  isActive: boolean;
  createdAt: string;
}

const API_BASE_URL = "http://192.168.1.6:5000";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [soldProperties, setSoldProperties] = useState<Property[]>([]);
  const [unsoldProperties, setUnsoldProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch all necessary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all properties
        const propertiesRes = await axios.get(`${API_BASE_URL}/api/admin/properties`);
        setProperties(propertiesRes.data.data);
        
        // Fetch sold properties
        const soldRes = await axios.get(`${API_BASE_URL}/api/admin/properties/sold`);
        setSoldProperties(soldRes.data.data);
        
        // Fetch unsold properties
        const unsoldRes = await axios.get(`${API_BASE_URL}/api/admin/properties/unsold`);
        setUnsoldProperties(unsoldRes.data.data);
        
        // Fetch all users
        const usersRes = await axios.get(`${API_BASE_URL}/api/admin/users`);
        setUsers(usersRes.data.data);
        
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data. Please check your connection.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Summary data calculations
  const summaryData = [
    { 
      title: "Total Properties", 
      value: properties.length, 
      change: "+2.5%", 
      icon: <FaHome className="text-blue-500" /> 
    },
    { 
      title: "Sold Properties", 
      value: soldProperties.length, 
      change: "+0.5%", 
      icon: <FaHome className="text-green-500" /> 
    },
    { 
      title: "Unsold Properties", 
      value: unsoldProperties.length, 
      change: "-1.2%", 
      icon: <FaHome className="text-orange-500" /> 
    },
    { 
      title: "Total Users", 
      value: users.length, 
      change: "+8.7%", 
      icon: <FaUsers className="text-purple-500" /> 
    }
  ];

  if (loading) return <Loader />;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-700">RealEstate Admin</h1>
        </div>
        <nav className="mt-8">
          <a href="#" className="flex items-center px-6 py-3 text-indigo-600 bg-indigo-50 border-l-4 border-indigo-600">
            <FaHome className="mr-3" />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100">
            <FaUsers className="mr-3" />
            <span>Users</span>
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100">
            <FaChartLine className="mr-3" />
            <span>Analytics</span>
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100">
            <FaCog className="mr-3" />
            <span>Settings</span>
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100">
            <FaSignOutAlt className="mr-3" />
            <span>Logout</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Dashboard</h1>
          <div className="flex items-center w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <div className="ml-4 relative">
              <button className="bg-gray-200 rounded-full p-2">
                <FaBell className="text-gray-600" />
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">3</span>
              </button>
            </div>
            <div className="ml-4 flex items-center">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=random" alt="Admin" className="w-10 h-10 rounded-full" />
              <div className="ml-2 hidden md:block">
                <p className="font-medium">Admin User</p>
                <p className="text-sm text-gray-600">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {summaryData.map((item, index) => (
            <SummaryCard 
              key={index}
              title={item.title}
              value={item.value}
              change={item.change}
              icon={item.icon}
            />
          ))}
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-4 md:p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Property Sales Overview</h2>
            <SalesChart soldCount={soldProperties.length} unsoldCount={unsoldProperties.length} />
          </div>
          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
            <RecentActivity properties={properties} users={users} />
          </div>
        </div>

        {/* Property Management */}
        <div className="bg-white rounded-xl shadow p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">Property Management</h2>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Add New Property
            </button>
          </div>
          <PropertyTable properties={properties} />
        </div>

        {/* User Management */}
        <div className="bg-white rounded-xl shadow p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">User Management</h2>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Add New User
            </button>
          </div>
          <UserTable users={users} />
        </div>
      </main>
    </div>
  );
}
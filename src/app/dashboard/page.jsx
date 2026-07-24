"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/component/Sidebar/Sidebar';
import Navbar from '@/component/Navbar/Navbar';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Sample data for line charts
  const salesData = [
    { month: 'Jan', sales: 125000, orders: 1250 },
    { month: 'Feb', sales: 150000, orders: 1420 },
    { month: 'Mar', sales: 185000, orders: 1680 },
    { month: 'Apr', sales: 170000, orders: 1550 },
    { month: 'May', sales: 210000, orders: 1890 },
    { month: 'Jun', sales: 225000, orders: 2100 },
    { month: 'Jul', sales: 248000, orders: 2350 },
    { month: 'Aug', sales: 267000, orders: 2580 },
    { month: 'Sep', sales: 290000, orders: 2750 },
    { month: 'Oct', sales: 312000, orders: 2980 },
    { month: 'Nov', sales: 345000, orders: 3250 },
    { month: 'Dec', sales: 380000, orders: 3580 },
  ];

  const growthData = [
    { month: 'Jan', restaurants: 180, hotels: 120, cafes: 70 },
    { month: 'Feb', restaurants: 195, hotels: 128, cafes: 75 },
    { month: 'Mar', restaurants: 210, hotels: 135, cafes: 80 },
    { month: 'Apr', restaurants: 218, hotels: 142, cafes: 84 },
    { month: 'May', restaurants: 225, hotels: 148, cafes: 88 },
    { month: 'Jun', restaurants: 235, hotels: 152, cafes: 92 },
    { month: 'Jul', restaurants: 240, hotels: 155, cafes: 95 },
    { month: 'Aug', restaurants: 243, hotels: 156, cafes: 97 },
    { month: 'Sep', restaurants: 245, hotels: 158, cafes: 98 },
  ];

  const weeklySales = [
    { day: 'Mon', sales: 45000, profit: 12000 },
    { day: 'Tue', sales: 52000, profit: 14500 },
    { day: 'Wed', sales: 48000, profit: 13200 },
    { day: 'Thu', sales: 55000, profit: 15800 },
    { day: 'Fri', sales: 68000, profit: 19500 },
    { day: 'Sat', sales: 75000, profit: 22000 },
    { day: 'Sun', sales: 72000, profit: 21000 },
  ];

  // Updated stats with new metrics
  const stats = [
    { label: 'Total Stores', value: '497', change: '+10%', color: 'from-blue-400 to-blue-600' },
    { label: 'Total Active', value: '423', change: '+8%', color: 'from-green-400 to-green-600' },
    { label: 'Total Inactive', value: '74', change: '-2%', color: 'from-red-400 to-red-600' },
    { label: 'Total Sales', value: '₹45.2L', change: '+22%', color: 'from-purple-400 to-purple-600' },
    { label: 'Subscription Pending', value: '28', change: '+5', color: 'from-orange-400 to-orange-600' },
  ];

  const topPerformers = [
    { name: 'The Grand Hotel', type: 'Hotel', profit: '₹12.5L', transactions: 1250 },
    { name: 'Spice Garden', type: 'Restaurant', profit: '₹8.2L', transactions: 3420 },
    { name: 'Coffee Brew', type: 'Cafe', profit: '₹3.8L', transactions: 2890 },
    { name: 'Royal Palace', type: 'Hotel', profit: '₹9.6L', transactions: 980 },
    { name: 'Sushi Kingdom', type: 'Restaurant', profit: '₹6.4L', transactions: 2100 },
  ];

  // Updated subscriptions with both active and inactive side by side
  const subscriptions = {
    active: [
      { name: 'The Grand Hotel', plan: 'Premium', expiry: '2025-12-31', amount: '₹3,999/mo' },
      { name: 'Spice Garden', plan: 'Standard', expiry: '2025-10-15', amount: '₹1,999/mo' },
      { name: 'Coffee Brew', plan: 'Basic', expiry: '2025-11-20', amount: '₹999/mo' },
      { name: 'Royal Palace', plan: 'Premium', expiry: '2026-01-10', amount: '₹3,999/mo' },
      { name: 'Pizza Hub', plan: 'Standard', expiry: '2025-12-05', amount: '₹1,999/mo' },
    ],
    inactive: [
      { name: 'Sunset Cafe', plan: 'Basic', expiry: '2024-12-31', amount: '₹999/mo' },
      { name: 'Burger King', plan: 'Premium', expiry: '2025-01-15', amount: '₹3,999/mo' },
      { name: 'Sushi Kingdom', plan: 'Standard', expiry: '2025-02-28', amount: '₹1,999/mo' },
      { name: 'Taco Bell', plan: 'Basic', expiry: '2025-03-15', amount: '₹999/mo' },
    ],
  };

  const subscriptionPending = [
    { name: 'Ocean View Hotel', plan: 'Premium', dueDate: '2025-05-20', amount: '₹3,999' },
    { name: 'Green Bites Cafe', plan: 'Standard', dueDate: '2025-05-18', amount: '₹1,999' },
    { name: 'Masala House', plan: 'Basic', dueDate: '2025-05-22', amount: '₹999' },
  ];

  const tickets = [
    { id: '#TKT001', issue: 'Payment Failed', priority: 'High', status: 'Open' },
    { id: '#TKT002', issue: 'Login Issue', priority: 'Medium', status: 'In Progress' },
    { id: '#TKT003', issue: 'Data Sync', priority: 'Low', status: 'Resolved' },
    { id: '#TKT004', issue: 'Report Generation', priority: 'High', status: 'Open' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        onClose={closeSidebar}
      />
      <Navbar 
        onMenuClick={toggleSidebar} 
        isSidebarOpen={isSidebarOpen} 
      />
      
      <div 
        className={`transition-all duration-300 mt-16 ${
          !isMobile && (isSidebarOpen ? 'ml-64' : 'ml-20')
        }`}
      >
        <div className="p-4 md:p-6">
         
          {/* Stats Cards - Updated with new metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-3 md:p-4 hover:shadow-lg transition-shadow">
                <p className="text-xs md:text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-lg md:text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className={`text-xs mt-1 ${stat.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          {/* Line Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Sales Trend Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
              <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Sales Trend (Yearly)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']}
                    contentStyle={{ fontSize: '12px' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Sales (₹)"
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Growth Chart - Restaurants, Hotels, Cafes */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
              <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Business Growth</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ fontSize: '12px' }} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="restaurants" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Restaurants"
                    dot={{ r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hotels" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="Hotels"
                    dot={{ r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cafes" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    name="Cafes"
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Sales Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mb-6 md:mb-8">
            <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Weekly Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => [`₹${value.toLocaleString()}`, '']}
                  contentStyle={{ fontSize: '12px' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Sales (₹)"
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Profit (₹)"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>


          {/* Subscriptions Section - Active and Inactive Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Active Subscriptions */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <h2 className="text-base md:text-lg font-semibold text-gray-800">Active Subscriptions</h2>
                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">{subscriptions.active.length} Active</span>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {subscriptions.active.map((sub, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm md:text-base">{sub.name}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{sub.plan}</span>
                        <span className="text-xs text-gray-500">Expires: {sub.expiry}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 text-sm md:text-base">{sub.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inactive Subscriptions */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <h2 className="text-base md:text-lg font-semibold text-gray-800">Inactive Subscriptions</h2>
                <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">{subscriptions.inactive.length} Inactive</span>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {subscriptions.inactive.map((sub, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm md:text-base">{sub.name}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded-full">{sub.plan}</span>
                        <span className="text-xs text-gray-500">Expired: {sub.expiry}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600 text-sm md:text-base">{sub.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subscription Pending Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex justify-between items-center mb-3 md:mb-4">
              <h2 className="text-base md:text-lg font-semibold text-gray-800">Subscription Payments Pending</h2>
              <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">{subscriptionPending.length} Pending</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead className="border-b border-gray-200">
                  <tr className="text-left text-xs md:text-sm text-gray-500">
                    <th className="pb-2 md:pb-3">Business Name</th>
                    <th className="pb-2 md:pb-3">Plan</th>
                    <th className="pb-2 md:pb-3">Due Date</th>
                    <th className="pb-2 md:pb-3">Amount</th>
                    <th className="pb-2 md:pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptionPending.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 md:py-3 font-medium text-gray-800 text-sm md:text-base">{item.name}</td>
                      <td className="py-2 md:py-3">
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">{item.plan}</span>
                      </td>
                      <td className="py-2 md:py-3 text-gray-600 text-sm md:text-base">{item.dueDate}</td>
                      <td className="py-2 md:py-3 font-semibold text-gray-800 text-sm md:text-base">{item.amount}</td>
                      <td className="py-2 md:py-3">
                        <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors">
                          Remind
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tickets Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Tickets Raised</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead className="border-b border-gray-200">
                  <tr className="text-left text-xs md:text-sm text-gray-500">
                    <th className="pb-2 md:pb-3">Ticket ID</th>
                    <th className="pb-2 md:pb-3">Issue</th>
                    <th className="pb-2 md:pb-3">Priority</th>
                    <th className="pb-2 md:pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 md:py-3 font-medium text-blue-600 text-sm md:text-base">{ticket.id}</td>
                      <td className="py-2 md:py-3 text-gray-800 text-sm md:text-base">{ticket.issue}</td>
                      <td className="py-2 md:py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          ticket.priority === 'High' ? 'bg-red-100 text-red-700' :
                          ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="py-2 md:py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          ticket.status === 'Open' ? 'bg-red-100 text-red-700' :
                          ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
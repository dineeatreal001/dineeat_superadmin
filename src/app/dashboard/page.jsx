"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/component/Sidebar/Sidebar';
import Navbar from '@/component/Navbar/Navbar';

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

  // Sample data for charts
  const stats = [
    { label: 'Total Hotels', value: '156', change: '+12%', color: 'from-blue-400 to-blue-600' },
    { label: 'Total Restaurants', value: '243', change: '+8%', color: 'from-green-400 to-green-600' },
    { label: 'Total Cafes', value: '98', change: '+15%', color: 'from-orange-400 to-orange-600' },
    { label: 'Total Clients', value: '497', change: '+10%', color: 'from-purple-400 to-purple-600' },
    { label: 'Total Sales', value: '₹45.2L', change: '+22%', color: 'from-pink-400 to-pink-600' },
  ];

  const topPerformers = [
    { name: 'The Grand Hotel', type: 'Hotel', profit: '₹12.5L', transactions: 1250 },
    { name: 'Spice Garden', type: 'Restaurant', profit: '₹8.2L', transactions: 3420 },
    { name: 'Coffee Brew', type: 'Cafe', profit: '₹3.8L', transactions: 2890 },
    { name: 'Royal Palace', type: 'Hotel', profit: '₹9.6L', transactions: 980 },
    { name: 'Sushi Kingdom', type: 'Restaurant', profit: '₹6.4L', transactions: 2100 },
  ];

  const subscriptions = {
    active: [
      { name: 'The Grand Hotel', plan: 'Premium', expiry: '2025-12-31' },
      { name: 'Spice Garden', plan: 'Standard', expiry: '2025-10-15' },
      { name: 'Coffee Brew', plan: 'Basic', expiry: '2025-11-20' },
    ],
    inactive: [
      { name: 'Sunset Cafe', plan: 'Basic', expiry: '2024-12-31' },
      { name: 'Burger King', plan: 'Premium', expiry: '2025-01-15' },
    ],
  };

  const liveOffers = [
    { name: 'Summer Special', discount: '20%', validTill: '2025-06-30' },
    { name: 'Weekend Brunch', discount: '15%', validTill: '2025-05-25' },
    { name: 'Happy Hours', discount: '10%', validTill: '2025-05-20' },
  ];

  const tickets = [
    { id: '#TKT001', issue: 'Payment Failed', priority: 'High', status: 'Open' },
    { id: '#TKT002', issue: 'Login Issue', priority: 'Medium', status: 'In Progress' },
    { id: '#TKT003', issue: 'Data Sync', priority: 'Low', status: 'Resolved' },
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
          {/* Welcome Section */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Welcome Rishi Urankar!</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">Hooray!! You're one step closer to managing your business.</p>
          </div>

          {/* Stats Cards - 2 per row on mobile, 5 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-3 md:p-4 hover:shadow-lg transition-shadow">
                <p className="text-xs md:text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-lg md:text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-green-600 mt-1">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Top Performers Section - Horizontal scroll on mobile */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mb-6 md:mb-8">
            <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Top 5 Performing Businesses</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead className="border-b border-gray-200">
                  <tr className="text-left text-xs md:text-sm text-gray-500">
                    <th className="pb-2 md:pb-3">Business Name</th>
                    <th className="pb-2 md:pb-3">Type</th>
                    <th className="pb-2 md:pb-3">Profit</th>
                    <th className="pb-2 md:pb-3">Transactions</th>
                  </tr>
                </thead>
                <tbody>
                  {topPerformers.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 md:py-3 font-medium text-gray-800 text-sm md:text-base">{item.name}</td>
                      <td className="py-2 md:py-3 text-gray-600 text-sm md:text-base">{item.type}</td>
                      <td className="py-2 md:py-3 text-green-600 font-semibold text-sm md:text-base">{item.profit}</td>
                      <td className="py-2 md:py-3 text-gray-600 text-sm md:text-base">{item.transactions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Two Column Layout - Stack on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Subscriptions */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
              <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Subscriptions</h2>
              
              <div className="mb-4">
                <h3 className="text-sm md:text-md font-medium text-green-600 mb-2">Active Subscriptions</h3>
                <div className="space-y-2">
                  {subscriptions.active.map((sub, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm md:text-base">{sub.name}</p>
                        <p className="text-xs text-gray-500">{sub.plan} • Expires: {sub.expiry}</p>
                      </div>
                      <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full ml-2">Active</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm md:text-md font-medium text-red-600 mb-2">Inactive Subscriptions</h3>
                <div className="space-y-2">
                  {subscriptions.inactive.map((sub, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm md:text-base">{sub.name}</p>
                        <p className="text-xs text-gray-500">{sub.plan} • Expired: {sub.expiry}</p>
                      </div>
                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full ml-2">Inactive</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Offers */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
              <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Live Offers</h2>
              <div className="space-y-3">
                {liveOffers.map((offer, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm md:text-base">{offer.name}</p>
                      <p className="text-xs text-gray-500">Valid till: {offer.validTill}</p>
                    </div>
                    <span className="text-xl md:text-2xl font-bold text-orange-600">{offer.discount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tickets Section - Horizontal scroll on mobile */}
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
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/component/Sidebar/Sidebar';
import Navbar from '@/component/Navbar/Navbar';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3085/api';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('superAdminToken') : null;
  return { headers: { Authorization: `Bearer ${token}` } };
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const monthKeyToLabel = (key) => {
  // key format "YYYY-MM"
  const [, m] = key.split('-');
  return MONTH_LABELS[parseInt(m, 10) - 1] || key;
};

const dateKeyToDayLabel = (key) => {
  // key format "YYYY-MM-DD"
  const d = new Date(key);
  return DAY_LABELS[d.getDay()];
};

const formatCurrency = (value) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value || 0}`;
};

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(false);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE_URL}/superadmin-auth/dashboard`, getAuthHeaders());
      if (res.data.success) {
        setDashboard(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // ============================================================
  // Transform raw API data into chart/list-ready shapes
  // ============================================================

  const salesTrend = useMemo(() => {
    if (!dashboard?.salesTrend) return [];
    return dashboard.salesTrend.map((row) => ({
      month: monthKeyToLabel(row._id),
      sales: row.sales || 0,
      orders: row.orders || 0,
    }));
  }, [dashboard]);

  const growthData = useMemo(() => {
    if (!dashboard?.growthData) return [];
    // raw rows: [{ _id: { month: "2026-01", type: "restaurant" }, count }]
    const byMonth = {};
    dashboard.growthData.forEach((row) => {
      const monthKey = row._id.month;
      const type = row._id.type; // "restaurant" | "hotel" | "cafe"
      if (!byMonth[monthKey]) {
        byMonth[monthKey] = { month: monthKeyToLabel(monthKey), restaurants: 0, hotels: 0, cafes: 0 };
      }
      if (type === 'restaurant') byMonth[monthKey].restaurants += row.count;
      if (type === 'hotel') byMonth[monthKey].hotels += row.count;
      if (type === 'cafe') byMonth[monthKey].cafes += row.count;
    });
    return Object.keys(byMonth)
      .sort()
      .map((k) => byMonth[k]);
  }, [dashboard]);

  const weeklySales = useMemo(() => {
    if (!dashboard?.weeklySales) return [];
    return dashboard.weeklySales.map((row) => ({
      day: dateKeyToDayLabel(row._id),
      sales: row.sales || 0,
    }));
  }, [dashboard]);

  const stats = useMemo(() => {
    const s = dashboard?.stats || {};
    return [
      { label: 'Total Stores', value: s.totalStores ?? 0 },
      { label: 'Total Active', value: s.totalActive ?? 0 },
      { label: 'Total Inactive', value: s.totalInactive ?? 0 },
      { label: 'Total Sales', value: formatCurrency(s.totalSales ?? 0) },
      { label: 'Subscription Pending', value: s.subscriptionPending ?? 0 },
    ];
  }, [dashboard]);

  const activeSubscriptions = useMemo(() => {
    if (!dashboard?.subscriptions?.active) return [];
    return dashboard.subscriptions.active.map((sub) => ({
      id: sub._id,
      name: sub.storeId?.storeInfo?.companyName || 'Unknown Store',
      plan: sub.planName,
      expiry: sub.endDate ? new Date(sub.endDate).toLocaleDateString('en-IN') : 'N/A',
      amount: `₹${sub.amount}`,
    }));
  }, [dashboard]);

  const inactiveSubscriptions = useMemo(() => {
    if (!dashboard?.subscriptions?.inactive) return [];
    return dashboard.subscriptions.inactive.map((sub) => ({
      id: sub._id,
      name: sub.storeId?.storeInfo?.companyName || 'Unknown Store',
      plan: sub.planName,
      expiry: sub.endDate ? new Date(sub.endDate).toLocaleDateString('en-IN') : 'N/A',
      amount: `₹${sub.amount}`,
    }));
  }, [dashboard]);

  const subscriptionPending = useMemo(() => {
    if (!dashboard?.subscriptionPending) return [];
    return dashboard.subscriptionPending.map((sub) => ({
      id: sub._id,
      name: sub.storeId?.storeInfo?.companyName || 'Unknown Store',
      plan: sub.planName,
      dueDate: sub.endDate ? new Date(sub.endDate).toLocaleDateString('en-IN') : 'N/A',
      amount: `₹${sub.amount}`,
    }));
  }, [dashboard]);

  const tickets = useMemo(() => {
    if (!dashboard?.tickets) return [];
    return dashboard.tickets.map((t) => ({
      id: t.ticketNumber,
      issue: t.subject,
      priority: t.priority,
      status: t.status,
    }));
  }, [dashboard]);

  const priorityStyle = (priority) => {
    const p = (priority || '').toLowerCase();
    if (p === 'high' || p === 'urgent') return 'bg-red-100 text-red-700';
    if (p === 'medium') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const statusStyle = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'open') return 'bg-red-100 text-red-700';
    if (s === 'in_progress') return 'bg-blue-100 text-blue-700';
    return 'bg-green-100 text-green-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

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

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-3 md:p-4 hover:shadow-lg transition-shadow">
                <p className="text-xs md:text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-lg md:text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Line Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Sales Trend Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
              <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Sales Trend (Yearly)</h2>
              {salesTrend.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-16">No sales data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesTrend}>
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
              )}
            </div>

            {/* Growth Chart - Restaurants, Hotels, Cafes */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
              <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Business Growth</h2>
              {growthData.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-16">No growth data yet.</p>
              ) : (
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
              )}
            </div>
          </div>

          {/* Weekly Sales Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mb-6 md:mb-8">
            <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Weekly Performance</h2>
            {weeklySales.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-16">No sales in the last 7 days.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
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
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Subscriptions Section - Active and Inactive Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Active Subscriptions */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <h2 className="text-base md:text-lg font-semibold text-gray-800">Active Subscriptions</h2>
                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">{activeSubscriptions.length} Active</span>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {activeSubscriptions.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">No active subscriptions.</p>
                ) : (
                  activeSubscriptions.map((sub) => (
                    <div key={sub.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg hover:shadow-md transition-shadow">
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
                  ))
                )}
              </div>
            </div>

            {/* Inactive Subscriptions */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <h2 className="text-base md:text-lg font-semibold text-gray-800">Inactive Subscriptions</h2>
                <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">{inactiveSubscriptions.length} Inactive</span>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {inactiveSubscriptions.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">No inactive subscriptions.</p>
                ) : (
                  inactiveSubscriptions.map((sub) => (
                    <div key={sub.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg hover:shadow-md transition-shadow">
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
                  ))
                )}
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
                  {subscriptionPending.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-gray-400">No pending payments.</td>
                    </tr>
                  ) : (
                    subscriptionPending.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
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
                    ))
                  )}
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
                  {tickets.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-sm text-gray-400">No tickets raised yet.</td>
                    </tr>
                  ) : (
                    tickets.map((ticket, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 md:py-3 font-medium text-blue-600 text-sm md:text-base">{ticket.id}</td>
                        <td className="py-2 md:py-3 text-gray-800 text-sm md:text-base">{ticket.issue}</td>
                        <td className="py-2 md:py-3">
                          <span className={`px-2 py-1 text-xs rounded-full capitalize ${priorityStyle(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="py-2 md:py-3">
                          <span className={`px-2 py-1 text-xs rounded-full capitalize ${statusStyle(ticket.status)}`}>
                            {ticket.status?.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
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
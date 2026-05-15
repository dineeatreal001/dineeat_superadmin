'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, Search, Loader2, Info, X, Calendar, 
  User, Phone, Mail, Download, Plus, Edit, Trash2,
  TrendingUp, Star, AlertCircle, Filter, CheckCircle,
  Clock, DollarSign, Package, Users, CreditCard,
  Zap, Gift, Award, Target, Shield, Sparkles
} from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Navbar from '@/component/Navbar/Navbar';
import Sidebar from '@/component/Sidebar/Sidebar';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3085/api';

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getSubscriptionStatusColor = (status) => {
  const colors = {
    'active': 'bg-green-100 text-green-700',
    'expired': 'bg-red-100 text-red-700',
    'cancelled': 'bg-gray-100 text-gray-700',
    'pending': 'bg-yellow-100 text-yellow-700',
  };
  return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700';
};

const getPlanColor = (plan) => {
  const colors = {
    'basic': 'from-gray-500 to-gray-600',
    'premium': 'from-blue-500 to-indigo-600',
    'enterprise': 'from-purple-500 to-pink-600',
  };
  return colors[plan?.toLowerCase()] || 'from-indigo-500 to-purple-600';
};

// Add Subscription Modal
function AddSubscriptionModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    planName: '',
    planType: 'basic',
    price: '',
    duration: 'monthly',
    features: [],
    description: '',
    maxStores: 1,
    maxItems: 50,
    supportLevel: 'basic'
  });
  const [feature, setFeature] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // API call to create subscription
      const response = await axios.post(`${API_BASE_URL}/subscriptions/create`, formData);
      if (response.data.success) {
        alert('Subscription plan created successfully!');
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert(error.response?.data?.message || 'Failed to create subscription');
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (feature.trim()) {
      setFormData({ ...formData, features: [...formData.features, feature.trim()] });
      setFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Add Subscription Plan</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label>
                <input
                  type="text"
                  value={formData.planName}
                  onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Type *</label>
                <select
                  value={formData.planType}
                  onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Stores</label>
                <input
                  type="number"
                  value={formData.maxStores}
                  onChange={(e) => setFormData({ ...formData, maxStores: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Items</label>
                <input
                  type="number"
                  value={formData.maxItems}
                  onChange={(e) => setFormData({ ...formData, maxItems: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => setFeature(e.target.value)}
                  placeholder="Add a feature"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {formData.features.map((f, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{f}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Create Plan'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Subscription Card Component
function SubscriptionCard({ subscription, onViewDetails }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className={`p-6 bg-gradient-to-r ${getPlanColor(subscription.planType)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-white" />
            <h3 className="text-xl font-bold text-white">{subscription.planName}</h3>
          </div>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-white/20 text-white`}>
            {subscription.planType}
          </span>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-bold text-white">₹{subscription.price}</p>
          <p className="text-white/80 text-sm">/{subscription.duration}</p>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="w-4 h-4" />
            <span>Max {subscription.maxStores} Store(s)</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>Up to {subscription.maxItems} Items</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{subscription.subscribers || 0} Active Subscribers</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {subscription.features?.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>{feature}</span>
            </div>
          ))}
          {subscription.features?.length > 3 && (
            <p className="text-xs text-indigo-600">+{subscription.features.length - 3} more features</p>
          )}
        </div>

        <button
          onClick={() => onViewDetails(subscription)}
          className="w-full py-2 bg-gradient-to-b from-blue-300 to-blue-500 text-white rounded-lg hover:shadow-lg transition font-medium"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
}

// User Subscription Modal
function UserSubscriptionsModal({ isOpen, onClose, users }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">User Subscriptions</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="p-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition cursor-pointer"
                  onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs rounded-full ${getSubscriptionStatusColor(user.subscription?.status)}`}>
                        {user.subscription?.status || 'No Plan'}
                      </span>
                      {user.subscription?.planName && (
                        <p className="text-xs text-gray-500 mt-1">{user.subscription?.planName}</p>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedUser?.id === user.id && user.subscription && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-500">Started On</p>
                            <p className="font-medium">{formatDate(user.subscription.startDate)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Expires On</p>
                            <p className="font-medium">{formatDate(user.subscription.endDate)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Amount Paid</p>
                            <p className="font-medium text-green-600">₹{user.subscription.amount}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Payment Method</p>
                            <p className="font-medium">{user.subscription.paymentMethod || 'N/A'}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function SubscriptionsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [stats, setStats] = useState({
    totalPlans: 0,
    activeSubscribers: 0,
    totalRevenue: 0,
    popularPlan: ''
  });

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchSubscriptions();
    fetchUsers();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriptions/all`);
      if (response.data.success) {
        setSubscriptions(response.data.data);
        calculateStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      // Demo data for testing
      const demoData = [
        {
          id: 1,
          planName: 'Basic Plan',
          planType: 'basic',
          price: 499,
          duration: 'monthly',
          maxStores: 1,
          maxItems: 50,
          features: ['Basic Support', '1 Store', '50 Items', 'Email Support'],
          subscribers: 45
        },
        {
          id: 2,
          planName: 'Premium Plan',
          planType: 'premium',
          price: 999,
          duration: 'monthly',
          maxStores: 3,
          maxItems: 200,
          features: ['Priority Support', '3 Stores', '200 Items', 'Email & Chat Support', 'Analytics'],
          subscribers: 28
        },
        {
          id: 3,
          planName: 'Enterprise Plan',
          planType: 'enterprise',
          price: 2499,
          duration: 'monthly',
          maxStores: 10,
          maxItems: 1000,
          features: ['24/7 Support', '10 Stores', 'Unlimited Items', 'Dedicated Account Manager', 'API Access', 'Custom Integration'],
          subscribers: 12
        }
      ];
      setSubscriptions(demoData);
      calculateStats(demoData);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/all`);
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Demo data for testing
      const demoUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', subscription: { planName: 'Premium Plan', status: 'active', startDate: '2024-01-01', endDate: '2024-12-31', amount: 999, paymentMethod: 'Card' } },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', subscription: { planName: 'Basic Plan', status: 'active', startDate: '2024-02-01', endDate: '2024-05-01', amount: 499, paymentMethod: 'UPI' } },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', subscription: { planName: 'Enterprise Plan', status: 'active', startDate: '2024-01-15', endDate: '2024-07-15', amount: 2499, paymentMethod: 'Bank Transfer' } }
      ];
      setUsers(demoUsers);
    }
  };

  const calculateStats = (data) => {
    const totalPlans = data.length;
    const activeSubscribers = data.reduce((sum, plan) => sum + (plan.subscribers || 0), 0);
    const totalRevenue = data.reduce((sum, plan) => sum + ((plan.subscribers || 0) * plan.price), 0);
    const popularPlan = data.reduce((prev, current) => 
      (prev.subscribers > current.subscribers) ? prev : current
    , data[0])?.planName || 'N/A';

    setStats({ totalPlans, activeSubscribers, totalRevenue, popularPlan });
  };

  const exportToExcel = () => {
    const exportData = subscriptions.map(sub => ({
      'Plan Name': sub.planName,
      'Plan Type': sub.planType,
      'Price (₹)': sub.price,
      'Duration': sub.duration,
      'Max Stores': sub.maxStores,
      'Max Items': sub.maxItems,
      'Active Subscribers': sub.subscribers || 0,
      'Features': sub.features?.join(', ') || 'N/A',
      'Estimated Revenue': (sub.subscribers || 0) * sub.price
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Subscriptions');
    const fileName = `subscriptions_export_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.planName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.planType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isSidebarOpen={isSidebarOpen} onClose={closeSidebar} />
      <Navbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className={`transition-all duration-300 pt-20 ${
        !isMobile && isSidebarOpen ? 'ml-64' : !isMobile && !isSidebarOpen ? 'ml-20' : 'ml-0'
      }`}>
        <div className="px-4 sm:px-6 py-4 sm:py-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Subscriptions</h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Manage plans and track user subscriptions</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUsersModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-blue-500 via-blue-600/50 to-blue-600 text-white rounded-lg hover:shadow-lg transition shadow-md font-medium text-sm"
              >
                <Users className="w-4 h-4" />
                View Users
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-indigo-300 to-indigo-600 text-white rounded-lg hover:shadow-lg transition shadow-md font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Plan
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Total Plans</p>
                  <p className="text-gray-900 text-xl sm:text-2xl font-bold mt-1">{stats.totalPlans}</p>
                </div>
                <div className="p-2 sm:p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Active Subscribers</p>
                  <p className="text-gray-900 text-xl sm:text-2xl font-bold mt-1">{stats.activeSubscribers}</p>
                </div>
                <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Monthly Revenue</p>
                  <p className="text-gray-900 text-xl sm:text-2xl font-bold mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Popular Plan</p>
                  <p className="text-gray-900 text-base sm:text-lg font-bold mt-1 truncate">{stats.popularPlan}</p>
                </div>
                <div className="p-2 sm:p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-4 mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search plans by name or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                onClick={exportToExcel}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition shadow-md font-medium text-sm"
              >
                <Download className="w-4 h-4" />
                Export to Excel
              </button>
            </div>
          </div>

          {/* Subscriptions Grid */}
          {filteredSubscriptions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl sm:rounded-2xl border border-gray-200">
              <Crown className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No subscription plans found</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 px-4 py-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
              >
                Create Your First Plan
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredSubscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onViewDetails={setSelectedSubscription}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddSubscriptionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchSubscriptions}
      />

      <UserSubscriptionsModal
        isOpen={showUsersModal}
        onClose={() => setShowUsersModal(false)}
        users={users}
      />

      {/* Subscription Details Modal */}
      <AnimatePresence>
        {selectedSubscription && (
          <SubscriptionDetailsModal 
            subscription={selectedSubscription} 
            onClose={() => setSelectedSubscription(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Subscription Details Modal Component
function SubscriptionDetailsModal({ subscription, onClose }) {
  if (!subscription) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`p-6 bg-gradient-to-r ${getPlanColor(subscription.planType)}`}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white">{subscription.planName}</h2>
                <p className="text-white/80 mt-1">{subscription.planType} Plan</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="mt-4">
              <p className="text-4xl font-bold text-white">₹{subscription.price}</p>
              <p className="text-white/80">/{subscription.duration}</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Plan Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Max Stores</p>
                  <p className="font-medium">{subscription.maxStores} Store(s)</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Max Items</p>
                  <p className="font-medium">Up to {subscription.maxItems} Items</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Active Subscribers</p>
                  <p className="font-medium">{subscription.subscribers || 0} Users</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Monthly Revenue</p>
                  <p className="font-medium text-green-600">₹{((subscription.subscribers || 0) * subscription.price).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Features Included</h3>
              <div className="space-y-2">
                {subscription.features?.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {subscription.description && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{subscription.description}</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
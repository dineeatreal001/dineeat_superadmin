'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, Search, Loader2, Info, X, Calendar,
  User, Phone, Mail, Download, Plus, Edit, Trash2,
  TrendingUp, Star, AlertCircle, Filter, CheckCircle,
  Clock, DollarSign, Package, Users, CreditCard,
  Zap, Gift, Award, Target, Shield, Sparkles,
  RefreshCw, Ban, Save, Check, AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Navbar from '@/component/Navbar/Navbar';
import Sidebar from '@/component/Sidebar/Sidebar';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3085/api';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('superAdminToken') : null;
  return { headers: { Authorization: `Bearer ${token}` } };
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const getSubscriptionStatusColor = (status) => {
  const colors = {
    'active': 'bg-green-100 text-green-700',
    'expired': 'bg-red-100 text-red-700',
    'cancelled': 'bg-gray-100 text-gray-700',
    'pending': 'bg-yellow-100 text-yellow-700',
    'auto_renew': 'bg-blue-100 text-blue-700'
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

const emptyPlanForm = {
  planName: '',
  planType: 'basic',
  price: '',
  duration: 'monthly',
  features: [],
  description: '',
  maxStores: 1,
  maxItems: 50,
  supportLevel: 'basic'
};

// ============================================================
// Toast Notification System
// ============================================================
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'from-green-500 to-emerald-600',
    error: 'from-red-500 to-rose-600',
    info: 'from-blue-500 to-indigo-600',
    warning: 'from-yellow-500 to-orange-600'
  };

  const icons = {
    success: <Check className="w-5 h-5" />,
    error: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`fixed top-4 right-4 z-[100] max-w-md w-full shadow-2xl rounded-xl overflow-hidden`}
    >
      <div className={`bg-gradient-to-r ${bgColors[type]} p-4 text-white`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-white/20 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 5, ease: 'linear' }}
          className="h-1 bg-white/30 mt-2 rounded-full"
        />
      </div>
    </motion.div>
  );
}

// ============================================================
// Create / Edit Plan Modal (shared — mode: 'create' | 'edit')
// ============================================================
function PlanFormModal({ isOpen, mode, onClose, subscription, onSuccess, showToast }) {
  const [formData, setFormData] = useState(emptyPlanForm);
  const [feature, setFeature] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && subscription) {
      setFormData({
        planName: subscription.planName || '',
        planType: subscription.planType || 'basic',
        price: subscription.price || '',
        duration: subscription.duration || 'monthly',
        features: subscription.features || [],
        description: subscription.description || '',
        maxStores: subscription.maxStores || 1,
        maxItems: subscription.maxItems || 50,
        supportLevel: subscription.supportLevel || 'basic'
      });
    } else if (mode === 'create') {
      setFormData(emptyPlanForm);
    }
  }, [subscription, mode, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (mode === 'create') {
        response = await axios.post(`${API_BASE_URL}/subscriptions/create`, formData, getAuthHeaders());
      } else {
        response = await axios.put(`${API_BASE_URL}/subscriptions/update/${subscription.id}`, formData, getAuthHeaders());
      }

      if (response.data.success) {
        showToast(
          mode === 'create' ? 'Subscription plan created successfully!' : 'Subscription plan updated successfully!',
          'success'
        );
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error saving subscription:', error);
      showToast(error.response?.data?.message || 'Failed to save subscription', 'error');
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
                {mode === 'create' ? <Plus className="w-5 h-5 text-white" /> : <Edit className="w-5 h-5 text-white" />}
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {mode === 'create' ? 'Create Subscription Plan' : 'Edit Subscription Plan'}
              </h2>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Support Level</label>
                <select
                  value={formData.supportLevel}
                  onChange={(e) => setFormData({ ...formData, supportLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="basic">Basic</option>
                  <option value="priority">Priority</option>
                  <option value="24/7">24/7</option>
                </select>
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
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
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : mode === 'create' ? 'Create Plan' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================================
// Delete Plan Confirmation Modal
// ============================================================
function DeletePlanModal({ isOpen, onClose, subscription, onSuccess, showToast }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`${API_BASE_URL}/subscriptions/delete/${subscription.id}`, getAuthHeaders());
      if (response.data.success) {
        showToast('Subscription plan deleted successfully!', 'success');
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      showToast(error.response?.data?.message || 'Failed to delete plan', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !subscription) return null;

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
          className="bg-white rounded-2xl max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-xl">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Subscription Plan</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{subscription.planName}</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Delete'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================================
// Assign Subscription Modal (for stores with no active plan)
// ============================================================
function AssignSubscriptionModal({ isOpen, onClose, store, plans, onSuccess, showToast }) {
  const [planId, setPlanId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPlanId('');
      setPaymentMethod('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!planId) return;
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/subscriptions/assign`,
        { storeId: store.id, planId, paymentMethod },
        getAuthHeaders()
      );
      if (response.data.success) {
        showToast('Subscription assigned successfully!', 'success');
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error assigning subscription:', error);
      showToast(error.response?.data?.message || 'Failed to assign subscription', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !store) return null;

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
          className="bg-white rounded-2xl max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Assign Subscription</h3>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Assigning a plan to <span className="font-semibold text-gray-800">{store.name}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Plan *</label>
                <select
                  value={planId}
                  onChange={(e) => setPlanId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Choose a plan...</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.planName} — ₹{p.price}/{p.duration}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select method...</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !planId}
                  className="flex-1 px-4 py-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Assign Plan'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================================
// Subscription Card
// ============================================================
function SubscriptionCard({ subscription, onViewDetails, onEdit, onDelete }) {
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
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/20 text-white">
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

        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(subscription)}
            className="flex-1 py-2 bg-gradient-to-b from-blue-400 to-blue-600 text-white rounded-lg hover:shadow-lg transition font-medium text-sm"
          >
            View Details
          </button>
          <button
            onClick={() => onEdit(subscription)}
            className="py-2 px-3 bg-gradient-to-b from-gray-400 to-gray-600 text-white rounded-lg hover:shadow-lg transition"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(subscription)}
            className="py-2 px-3 bg-gradient-to-b from-red-400 to-red-600 text-white rounded-lg hover:shadow-lg transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// User / Store Subscription Manager
// ============================================================
function UserSubscriptionManager({ users, plans, onRefresh, showToast }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionModal, setActionModal] = useState(null);
  const [assignModalStore, setAssignModalStore] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRenewSubscription = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/subscriptions/renew/${userId}`, {}, getAuthHeaders());
      if (response.data.success) {
        showToast('Subscription renewed successfully!', 'success');
        onRefresh();
        setActionModal(null);
      }
    } catch (error) {
      console.error('Error renewing subscription:', error);
      showToast(error.response?.data?.message || 'Failed to renew subscription', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/subscriptions/cancel/${userId}`, {}, getAuthHeaders());
      if (response.data.success) {
        showToast('Subscription cancelled successfully!', 'success');
        onRefresh();
        setActionModal(null);
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      showToast(error.response?.data?.message || 'Failed to cancel subscription', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAutoRenew = async (userId, currentStatus) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/subscriptions/auto-renew/${userId}`,
        { autoRenew: !currentStatus },
        getAuthHeaders()
      );
      if (response.data.success) {
        showToast(`Auto-renew ${!currentStatus ? 'enabled' : 'disabled'} successfully!`, 'success');
        onRefresh();
        setActionModal(null);
      }
    } catch (error) {
      console.error('Error toggling auto-renew:', error);
      showToast(error.response?.data?.message || 'Failed to update auto-renew setting', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isExpired = (endDate) => {
    return endDate ? new Date(endDate) < new Date() : false;
  };

  return (
    <div className="space-y-4">
      {users.map((user) => {
        const expired = isExpired(user.subscription?.endDate);
        const isActive = user.subscription?.status === 'active' && !expired;
        const hasNoPlan = !user.subscription || user.subscription?.status === 'cancelled';

        return (
          <div key={user.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getSubscriptionStatusColor(user.subscription?.status)}`}>
                  {user.subscription?.status || 'No Plan'}
                </span>
                {user.subscription?.planName && (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                    {user.subscription.planName}
                  </span>
                )}
                {user.subscription?.autoRenew && (
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    Auto-Renew
                  </span>
                )}
                {hasNoPlan && (
                  <button
                    onClick={() => setAssignModalStore(user)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500 text-white text-xs rounded-lg hover:bg-indigo-600 transition"
                  >
                    <Plus className="w-3 h-3" />
                    Assign Plan
                  </button>
                )}
              </div>
            </div>

            {user.subscription && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm mb-4">
                  <div>
                    <p className="text-gray-500 text-xs">Started On</p>
                    <p className="font-medium text-sm">{formatDate(user.subscription.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Expires On</p>
                    <p className={`font-medium text-sm ${expired ? 'text-red-600' : ''}`}>
                      {formatDate(user.subscription.endDate)}
                      {expired && <span className="ml-1 text-xs text-red-500">(Expired)</span>}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Amount Paid</p>
                    <p className="font-medium text-sm text-green-600">₹{user.subscription.amount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Payment Method</p>
                    <p className="font-medium text-sm">{user.subscription.paymentMethod || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {expired && user.subscription?.status !== 'cancelled' && (
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setActionModal('renew');
                      }}
                      disabled={loading}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Renew Subscription
                    </button>
                  )}

                  {isActive && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setActionModal('autoRenew');
                        }}
                        disabled={loading}
                        className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition ${
                          user.subscription?.autoRenew
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        <RefreshCw className="w-3 h-3" />
                        {user.subscription?.autoRenew ? 'Disable Auto-Renew' : 'Enable Auto-Renew'}
                      </button>

                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setActionModal('cancel');
                        }}
                        disabled={loading}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition"
                      >
                        <Ban className="w-3 h-3" />
                        Cancel Subscription
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Action Confirmation Modal */}
      <AnimatePresence>
        {actionModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setActionModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {actionModal === 'renew' && 'Renew Subscription'}
                  {actionModal === 'cancel' && 'Cancel Subscription'}
                  {actionModal === 'autoRenew' && `${selectedUser.subscription?.autoRenew ? 'Disable' : 'Enable'} Auto-Renew`}
                </h3>
                <p className="text-gray-600 mb-6">
                  {actionModal === 'renew' && `Are you sure you want to renew the subscription for ${selectedUser.name}?`}
                  {actionModal === 'cancel' && `Are you sure you want to cancel the subscription for ${selectedUser.name}? This action can be reversed.`}
                  {actionModal === 'autoRenew' && `Are you sure you want to ${selectedUser.subscription?.autoRenew ? 'disable' : 'enable'} auto-renew for ${selectedUser.name}?`}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setActionModal(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (actionModal === 'renew') handleRenewSubscription(selectedUser.id);
                      if (actionModal === 'cancel') handleCancelSubscription(selectedUser.id);
                      if (actionModal === 'autoRenew') handleToggleAutoRenew(selectedUser.id, selectedUser.subscription?.autoRenew);
                    }}
                    disabled={loading}
                    className={`flex-1 px-4 py-2 rounded-lg text-white transition ${
                      actionModal === 'cancel'
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirm'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AssignSubscriptionModal
        isOpen={!!assignModalStore}
        onClose={() => setAssignModalStore(null)}
        store={assignModalStore}
        plans={plans}
        onSuccess={onRefresh}
        showToast={showToast}
      />
    </div>
  );
}

// ============================================================
// Subscription Details Modal (View Only)
// ============================================================
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
                  <p className="font-medium">{subscription.subscribers || 0} Stores</p>
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

// ============================================================
// Main Page
// ============================================================
export default function SubscriptionsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planModalMode, setPlanModalMode] = useState('create');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({
    totalPlans: 0,
    activeSubscribers: 0,
    totalRevenue: 0,
    popularPlan: ''
  });

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
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
      const response = await axios.get(`${API_BASE_URL}/subscriptions/all`, getAuthHeaders());
      if (response.data.success) {
        setSubscriptions(response.data.data);
        calculateStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      showToast('Failed to fetch subscriptions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriptions/stores/all`, getAuthHeaders());
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('Failed to fetch stores', 'error');
    }
  };

  const calculateStats = (data) => {
    const totalPlans = data.length;
    const activeSubscribers = data.reduce((sum, plan) => sum + (plan.subscribers || 0), 0);
    const totalRevenue = data.reduce((sum, plan) => sum + ((plan.subscribers || 0) * plan.price), 0);
    const popularPlan = data.length
      ? data.reduce((prev, current) => (prev.subscribers > current.subscribers ? prev : current), data[0])?.planName
      : 'N/A';

    setStats({ totalPlans, activeSubscribers, totalRevenue, popularPlan: popularPlan || 'N/A' });
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
    showToast('Export completed successfully!', 'success');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => {
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleCreateClick = () => {
    setSelectedSubscription(null);
    setPlanModalMode('create');
    setShowPlanModal(true);
  };

  const handleEditClick = (subscription) => {
    setSelectedSubscription(subscription);
    setPlanModalMode('edit');
    setShowPlanModal(true);
  };

  const handleDeleteClick = (subscription) => {
    setDeleteTarget(subscription);
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
      {/* Toast Container */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </AnimatePresence>

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
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Subscription Management</h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Manage plans and store subscriptions</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleCreateClick}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition shadow-md font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Create Plan
              </button>
              <button
                onClick={exportToExcel}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition shadow-md font-medium text-sm"
              >
                <Download className="w-4 h-4" />
                Export to Excel
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Total Plans</p>
                  <p className="text-gray-900 text-xl sm:text-2xl font-bold mt-1">{stats.totalPlans}</p>
                </div>
                <div className="p-2 sm:p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Active Subscribers</p>
                  <p className="text-gray-900 text-xl sm:text-2xl font-bold mt-1">{stats.activeSubscribers}</p>
                </div>
                <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Monthly Revenue</p>
                  <p className="text-gray-900 text-xl sm:text-2xl font-bold mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Popular Plan</p>
                  <p className="text-gray-900 text-base sm:text-lg font-bold mt-1 truncate">{stats.popularPlan}</p>
                </div>
                <div className="p-2 sm:p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('subscriptions')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === 'subscriptions' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Subscription Plans
                {activeTab === 'subscriptions' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === 'users' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Store Subscriptions
                {activeTab === 'users' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                )}
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {activeTab === 'subscriptions' ? (
                <>
                  {subscriptions.length === 0 ? (
                    <div className="text-center py-12">
                      <Crown className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No subscription plans found</p>
                      <button
                        onClick={handleCreateClick}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-medium text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Create your first plan
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {subscriptions.map((subscription) => (
                        <SubscriptionCard
                          key={subscription.id}
                          subscription={subscription}
                          onViewDetails={setSelectedSubscription}
                          onEdit={handleEditClick}
                          onDelete={handleDeleteClick}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <UserSubscriptionManager
                  users={users}
                  plans={subscriptions}
                  onRefresh={() => {
                    fetchUsers();
                    fetchSubscriptions();
                  }}
                  showToast={showToast}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create / Edit Plan Modal */}
      <PlanFormModal
        isOpen={showPlanModal}
        mode={planModalMode}
        onClose={() => {
          setShowPlanModal(false);
          setSelectedSubscription(null);
        }}
        subscription={selectedSubscription}
        onSuccess={fetchSubscriptions}
        showToast={showToast}
      />

      {/* Delete Plan Modal */}
      <DeletePlanModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        subscription={deleteTarget}
        onSuccess={fetchSubscriptions}
        showToast={showToast}
      />

      {/* Subscription Details Modal (view only) */}
      <AnimatePresence>
        {selectedSubscription && !showPlanModal && (
          <SubscriptionDetailsModal
            subscription={selectedSubscription}
            onClose={() => setSelectedSubscription(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
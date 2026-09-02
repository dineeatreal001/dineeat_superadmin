"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/component/Sidebar/Sidebar';
import Navbar from '@/component/Navbar/Navbar';
import axios from 'axios';

const ManageStorePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Features list
  const featuresList = [
    { id: 'qr_ordering', label: 'QR Ordering', icon: '📱' },
    { id: 'online_payment', label: 'Online Payment', icon: '💳' },
    { id: 'table_reservation', label: 'Table Reservation', icon: '📋' },
    { id: 'loyalty_program', label: 'Loyalty Program', icon: '⭐' },
    { id: 'delivery_integration', label: 'Delivery Integration', icon: '🚚' },
    { id: 'analytics_dashboard', label: 'Analytics Dashboard', icon: '📊' },
    { id: 'custom_menu', label: 'Custom Menu', icon: '📝' },
    { id: 'staff_management', label: 'Staff Management', icon: '👥' },
    { id: 'inventory_tracking', label: 'Inventory Tracking', icon: '📦' },
    { id: 'customer_feedback', label: 'Customer Feedback', icon: '💬' },
  ];

  const [allowedFeatures, setAllowedFeatures] = useState([]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    fetchStores();
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/store/all`);
      setStores(response.data.stores || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
      alert('Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (store) => {
    setSelectedStore(store);
    setIsDetailsModalOpen(true);
  };

  const handleSettingsClick = (store, e) => {
    e.stopPropagation();
    setSelectedStore(store);
    if (store.allowedFeatures) {
      setAllowedFeatures(store.allowedFeatures);
    } else {
      setAllowedFeatures([]);
    }
    setIsFeaturesModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedStore(null);
  };

  const handleCloseFeaturesModal = () => {
    setIsFeaturesModalOpen(false);
    setSelectedStore(null);
    setAllowedFeatures([]);
  };

  const handleFeatureToggle = (featureId) => {
    setAllowedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleSaveFeatures = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_URL}/store/update-features/${selectedStore._id}`,
        { allowedFeatures }
      );
      
      if (response.data.success) {
        setStores(stores.map(store => 
          store._id === selectedStore._id 
            ? { ...store, allowedFeatures }
            : store
        ));
        alert('Features updated successfully!');
        handleCloseFeaturesModal();
      }
    } catch (error) {
      console.error('Error updating features:', error);
      alert('Failed to update features');
    }
  };

  const handleToggleStatus = async (storeId, currentStatus) => {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_URL}/store/toggle-status/${storeId}`, {
        isActive: !currentStatus
      });
      
      if (response.data.success) {
        setStores(stores.map(store => 
          store._id === storeId 
            ? { ...store, isActive: !currentStatus }
            : store
        ));
        alert(`Store ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      }
    } catch (error) {
      console.error('Error toggling store status:', error);
      alert('Failed to update store status');
    }
  };

  const handleToggleVerification = async (storeId, currentStatus) => {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_URL}/store/toggle-verification/${storeId}`, {
        isVerified: !currentStatus
      });
      
      if (response.data.success) {
        setStores(stores.map(store => 
          store._id === storeId 
            ? { ...store, isVerified: !currentStatus }
            : store
        ));
        alert(`Store ${!currentStatus ? 'verified' : 'unverified'} successfully`);
      }
    } catch (error) {
      console.error('Error toggling verification:', error);
      alert('Failed to update verification status');
    }
  };

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.storeInfo.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.storeInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.storeInfo.phone.includes(searchTerm);
    const matchesType = filterType === 'all' || store.storeInfo.type === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && store.isActive) ||
                         (filterStatus === 'inactive' && !store.isActive);
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStoreTypeColor = (type) => {
    switch(type) {
      case 'hotel': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'restaurant': return 'bg-green-50 text-green-700 border-green-200';
      case 'cafe': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getSubscriptionColor = (plan) => {
    switch(plan) {
      case 'premium': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'standard': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'basic': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'enterprise': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Store Details Modal
  const StoreDetailsModal = () => {
    if (!selectedStore) return null;

    return (
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleCloseDetailsModal}
      >
        <div 
          className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-blue-600 p-5 flex justify-between items-center rounded-t-2xl">
            <h2 className="text-xl font-semibold text-white">Store Details</h2>
            <button 
              onClick={handleCloseDetailsModal}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Store Header */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600 flex-shrink-0">
                {selectedStore.storeInfo.companyName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">{selectedStore.storeInfo.companyName}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStoreTypeColor(selectedStore.storeInfo.type)} capitalize`}>
                    {selectedStore.storeInfo.type}
                  </span>
                  {selectedStore.isVerified && (
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full border bg-green-50 text-green-700 border-green-200">
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700">{selectedStore.storeInfo.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-700">{selectedStore.storeInfo.phone}</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-700">{selectedStore.storeInfo.fullAddress}</span>
              </div>
            </div>

            {/* Store Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-blue-600">{selectedStore.items?.length || 0}</p>
                <p className="text-xs text-gray-600">Items</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-green-600">{selectedStore.branches?.length || 0}</p>
                <p className="text-xs text-gray-600">Branches</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-purple-600">{selectedStore.admins?.length || 0}</p>
                <p className="text-xs text-gray-600">Admins</p>
              </div>
            </div>

            {/* Additional Details */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-semibold text-gray-700 mb-3">Additional Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Subscription Plan</span>
                  <span className="font-medium text-gray-800 capitalize">{selectedStore.otherDetails?.subscriptionType || 'Not set'}</span>
                </div>
                <div className="flex justify-between py-1 border-t border-gray-100">
                  <span className="text-gray-500">Operating Hours</span>
                  <span className="font-medium text-gray-800">
                    {selectedStore.menuDetails?.openingTime || 'N/A'} - {selectedStore.menuDetails?.closingTime || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-t border-gray-100">
                  <span className="text-gray-500">Joined Date</span>
                  <span className="font-medium text-gray-800">
                    {new Date(selectedStore.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Admins List */}
            {selectedStore.admins && selectedStore.admins.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-700 mb-3">Administrators</h4>
                <div className="space-y-2">
                  {selectedStore.admins.map((admin, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-indigo-600">
                        {admin.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">{admin.name}</p>
                        <p className="text-xs text-gray-500">{admin.email}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full capitalize">
                        {admin.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Features Modal
  const FeaturesModal = () => {
    if (!selectedStore) return null;

    return (
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleCloseFeaturesModal}
      >
        <div 
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-blue-600 p-5 flex justify-between items-center rounded-t-2xl">
            <div>
              <h2 className="text-xl font-semibold text-white">Store Settings</h2>
              <p className="text-sm text-white/80 mt-1">Manage store features and permissions</p>
            </div>
            <button 
              onClick={handleCloseFeaturesModal}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Store Header */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center text-lg font-bold text-indigo-600">
                {selectedStore.storeInfo.companyName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{selectedStore.storeInfo.companyName}</h3>
                <p className="text-sm text-gray-500">{selectedStore.storeInfo.email}</p>
              </div>
            </div>

            {/* Status Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">Store Status</p>
                    <p className="text-xs text-gray-500 mt-1">Enable/disable store</p>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(selectedStore._id, selectedStore.isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      selectedStore.isActive ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        selectedStore.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs mt-2 text-gray-400">
                  {selectedStore.isActive ? 'Store is active and accessible' : 'Store is inactive'}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">Verification</p>
                    <p className="text-xs text-gray-500 mt-1">Verify store</p>
                  </div>
                  <button
                    onClick={() => handleToggleVerification(selectedStore._id, selectedStore.isVerified)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      selectedStore.isVerified ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        selectedStore.isVerified ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs mt-2 text-gray-400">
                  {selectedStore.isVerified ? 'Store is verified' : 'Store is not verified'}
                </p>
              </div>
            </div>

            {/* Allowed Features */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">Allowed Features</h3>
                  <p className="text-sm text-gray-500">Select features available for this store</p>
                </div>
                <span className="text-xs text-gray-400">
                  {allowedFeatures.length} selected
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {featuresList.map((feature) => (
                  <label 
                    key={feature.id}
                    className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      allowedFeatures.includes(feature.id)
                        ? 'border-indigo-400 bg-indigo-50'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={allowedFeatures.includes(feature.id)}
                      onChange={() => handleFeatureToggle(feature.id)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-lg">{feature.icon}</span>
                    <span className="text-sm text-gray-700 flex-1">{feature.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={handleCloseFeaturesModal}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFeatures}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl hover:opacity-90 transition-opacity shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isSidebarOpen={isSidebarOpen} onClose={closeSidebar} />
      <Navbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div 
        className={`transition-all duration-300 mt-16 ${
          !isMobile && (isSidebarOpen ? 'ml-64' : 'ml-20')
        }`}
      >
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manage Stores</h1>
                <p className="text-gray-500 mt-1">View and manage all registered stores</p>
              </div>
              <div className="mt-2 md:mt-0">
                <span className="text-sm text-gray-500">
                  Total Stores: <span className="font-semibold text-gray-700">{stores.length}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Search</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by name, email or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Store Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="hotel">Hotel</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="cafe">Cafe</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stores Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map((store) => (
                <div 
                  key={store._id} 
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => handleCardClick(store)}
                >
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center text-xl font-bold text-indigo-600 flex-shrink-0">
                          {store.storeInfo.companyName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 text-base truncate">{store.storeInfo.companyName}</h3>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStoreTypeColor(store.storeInfo.type)} capitalize`}>
                              {store.storeInfo.type}
                            </span>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getSubscriptionColor(store.otherDetails?.subscriptionType)} capitalize`}>
                              {store.otherDetails?.subscriptionType || 'No Plan'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleSettingsClick(store, e)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-100 rounded-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-600 truncate">{store.storeInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-600">{store.storeInfo.phone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-600 text-xs truncate">
                        {store.storeInfo.city}, {store.storeInfo.state}
                      </span>
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="font-medium text-gray-700">{store.items?.length || 0}</span> Items
                      </span>
                      <span className="w-px h-4 bg-gray-300"></span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium text-gray-700">{store.branches?.length || 0}</span> Branches
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${store.isActive ? 'bg-green-500' : 'bg-red-400'}`}></span>
                      <span className="text-xs text-gray-500">
                        {store.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredStores.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">No stores found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isDetailsModalOpen && <StoreDetailsModal />}
      {isFeaturesModalOpen && <FeaturesModal />}
    </div>
  );
};

export default ManageStorePage;
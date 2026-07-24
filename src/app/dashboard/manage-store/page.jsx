"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/component/Sidebar/Sidebar';
import Navbar from '@/component/Navbar/Navbar';
import axios from 'axios';

const ManageStorePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

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

  const handleSettingsClick = (store) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStore(null);
  };

  const handleToggleStatus = async (storeId, currentStatus) => {
    try {
      // API call to toggle store status
      const response = await axios.put(`${process.env.NEXT_PUBLIC_URL}/store/toggle-status/${storeId}`, {
        isActive: !currentStatus
      });
      
      if (response.data.success) {
        // Update local state
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

  // Filter stores based on search and filters
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
      case 'hotel': return 'bg-blue-100 text-blue-700';
      case 'restaurant': return 'bg-green-100 text-green-700';
      case 'cafe': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSubscriptionColor = (plan) => {
    switch(plan) {
      case 'premium': return 'bg-purple-100 text-purple-700';
      case 'standard': return 'bg-blue-100 text-blue-700';
      case 'basic': return 'bg-gray-100 text-gray-700';
      case 'enterprise': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Settings Modal Component
  const SettingsModal = () => {
    if (!selectedStore) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Store Settings</h2>
            <button 
              onClick={handleCloseModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-4 space-y-6">
            {/* Store Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">{selectedStore.storeInfo.companyName}</h3>
              <p className="text-sm text-gray-600">{selectedStore.storeInfo.email}</p>
              <p className="text-sm text-gray-600">{selectedStore.storeInfo.phone}</p>
            </div>

            {/* Toggle Buttons */}
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Store Status</p>
                  <p className="text-xs text-gray-500">Enable or disable store access</p>
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

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Verification Status</p>
                  <p className="text-xs text-gray-500">Verify store authenticity</p>
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
            </div>

            {/* Store Details */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Store Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Type:</span> <span className="capitalize">{selectedStore.storeInfo.type}</span></p>
                <p><span className="text-gray-500">Plan:</span> <span className="capitalize">{selectedStore.plan || 'Pro Plan'}</span></p>
                <p><span className="text-gray-500">Subscription:</span> <span className="capitalize">{selectedStore.otherDetails?.subscriptionType || 'Not set'}</span></p>
                <p><span className="text-gray-500">Address:</span> {selectedStore.storeInfo.fullAddress}</p>
                <p><span className="text-gray-500">City:</span> {selectedStore.storeInfo.city}, {selectedStore.storeInfo.state} - {selectedStore.storeInfo.pincode}</p>
              </div>
            </div>

            {/* Items Summary */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Menu Summary</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Total Items:</span> {selectedStore.items?.length || 0}</p>
                <p><span className="text-gray-500">Categories:</span> {[...new Set(selectedStore.items?.map(item => item.category).filter(Boolean))].length || 0}</p>
                <p><span className="text-gray-500">Operating Hours:</span> {selectedStore.menuDetails?.openingTime || 'N/A'} - {selectedStore.menuDetails?.closingTime || 'N/A'}</p>
              </div>
            </div>

            {/* Admins Summary */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Administrators</h3>
              <div className="space-y-2">
                {selectedStore.admins?.map((admin, idx) => (
                  <div key={idx} className="text-sm p-2 bg-gray-50 rounded">
                    <p className="font-medium">{admin.name}</p>
                    <p className="text-gray-500 text-xs">{admin.email} • {admin.role}</p>
                  </div>
                ))}
                {(!selectedStore.admins || selectedStore.admins.length === 0) && (
                  <p className="text-sm text-gray-500">No admins assigned</p>
                )}
              </div>
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
          <div className="mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Manage Stores</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">View and manage all registered stores</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
                <input
                  type="text"
                  placeholder="Search by name, email or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Store Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="all">All Types</option>
                  <option value="hotel">Hotel</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="cafe">Cafe</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stores Grid - 2 cards per row on mobile */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredStores.map((store) => (
                <div key={store._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Store Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-base mb-1">{store.storeInfo.companyName}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getStoreTypeColor(store.storeInfo.type)} capitalize`}>
                            {store.storeInfo.type}
                          </span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getSubscriptionColor(store.otherDetails?.subscriptionType)} capitalize`}>
                            {store.otherDetails?.subscriptionType || 'No Plan'}
                          </span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${store.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {store.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {store.isVerified && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleSettingsClick(store)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Store Details */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-600">{store.storeInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-600">{store.storeInfo.phone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-600 text-xs">
                        {store.storeInfo.city}, {store.storeInfo.state}
                      </span>
                    </div>
                  </div>

                  {/* Store Footer */}
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      <span>Items: {store.items?.length || 0}</span>
                      <span className="mx-2">•</span>
                      <span>Branches: {store.branches?.length || 0}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Joined: {new Date(store.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredStores.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-gray-500">No stores found</p>
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {isModalOpen && <SettingsModal />}
    </div>
  );
};

export default ManageStorePage;
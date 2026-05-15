'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, Search, Loader2, Info, X, MapPin, 
  Package, Calendar, User, Phone, Mail, 
  Download, ChevronDown, Tag, Clock, Building2,
  TrendingUp, Star, AlertCircle, Menu, Filter
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

const getStoreTypeColor = (type) => {
  const colors = {
    'hotel': 'bg-orange-100 text-orange-700',
    'restaurant': 'bg-green-100 text-green-700',
    'cafe': 'bg-blue-100 text-blue-700',
  };
  return colors[type?.toLowerCase()] || 'bg-gray-100 text-gray-700';
};

// Store Details Modal Component
function StoreDetailsModal({ store, onClose }) {
  if (!store) return null;

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
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{store.storeInfo?.companyName || 'Store Details'}</h2>
              <p className="text-gray-500 text-sm mt-1">ID: {store._id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Store Information */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                <Store className="w-4 h-4 text-indigo-600" />
                Store Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-xs">Company Name</p>
                  <p className="text-gray-900 text-sm font-medium">{store.storeInfo?.companyName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Store Type</p>
                  <p className="text-gray-900 text-sm font-medium">{store.storeInfo?.type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Owner Name</p>
                  <p className="text-gray-900 text-sm">{store.storeInfo?.fullName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Phone</p>
                  <p className="text-gray-900 text-sm">{store.storeInfo?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Email</p>
                  <p className="text-gray-900 text-sm">{store.storeInfo?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Alternate Number</p>
                  <p className="text-gray-900 text-sm">{store.storeInfo?.alternateNumber || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" />
                Address Information
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700 text-sm">{store.storeInfo?.fullAddress || 'N/A'}</p>
                {store.storeInfo?.landmark && (
                  <p className="text-gray-500 text-sm">Landmark: {store.storeInfo.landmark}</p>
                )}
                <p className="text-gray-500 text-sm">
                  {store.storeInfo?.city}, {store.storeInfo?.state} - {store.storeInfo?.pincode}
                </p>
              </div>
            </div>

            {/* Menu Details */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                <Menu className="w-4 h-4 text-indigo-600" />
                Menu Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-xs">Total Items</p>
                  <p className="text-gray-900 text-lg font-bold">{store.menuDetails?.numberOfItems || '0'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Item Types</p>
                  <p className="text-gray-900 text-lg font-bold">{store.menuDetails?.numberOfItemTypes || '0'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Opening Time</p>
                  <p className="text-gray-900 text-sm">{store.menuDetails?.openingTime || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Closing Time</p>
                  <p className="text-gray-900 text-sm">{store.menuDetails?.closingTime || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Categories */}
            {store.categories && store.categories.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-600" />
                  Categories ({store.categories.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {store.categories.map((category, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Items */}
            {store.items && store.items.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-indigo-600" />
                  Menu Items ({store.items.length})
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {store.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                      <div>
                        <p className="text-gray-900 font-medium">{item.name}</p>
                        <p className="text-gray-500 text-xs">
                          {item.quantity} {item.quantityType} | Tax: {item.taxRate}%
                        </p>
                      </div>
                      <p className="text-indigo-600 font-semibold">₹{item.unitPrice}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Business Details */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                Business Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-xs">Billing Type</p>
                  <p className="text-gray-900 text-sm">{store.otherDetails?.billingType || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">GST Number</p>
                  <p className="text-gray-900 text-sm">{store.otherDetails?.gstinNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">MSME Number</p>
                  <p className="text-gray-900 text-sm">{store.otherDetails?.msmeNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Payment Method</p>
                  <p className="text-gray-900 text-sm">{store.otherDetails?.paymentMethod || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Timeline
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Created At:</span>
                  <span className="text-gray-900 text-sm">{formatDate(store.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Last Updated:</span>
                  <span className="text-gray-900 text-sm">{formatDate(store.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Store Card Component
function StoreCard({ store, onViewDetails }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="p-4 sm:p-6">
        {/* Store Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex-shrink-0">
              <Store className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                {store.storeInfo?.companyName || 'Unnamed Store'}
              </h3>
              <span className={`inline-flex px-2 py-0.5 text-xs rounded-full ${getStoreTypeColor(store.storeInfo?.type)}`}>
                {store.storeInfo?.type || 'Store'}
              </span>
            </div>
          </div>
          <button
            onClick={() => onViewDetails(store)}
            className="p-2 rounded-lg hover:bg-gray-100 transition flex-shrink-0"
            title="View Details"
          >
            <Info className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Store Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm truncate">
            <User className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{store.storeInfo?.fullName || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm">
            <Phone className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{store.storeInfo?.phone || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm">
            <Mail className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{store.storeInfo?.email || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{store.storeInfo?.city}, {store.storeInfo?.state}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-indigo-600 text-base sm:text-lg font-bold">{store.categories?.length || 0}</p>
            <p className="text-gray-500 text-xs">Categories</p>
          </div>
          <div className="text-center">
            <p className="text-indigo-600 text-base sm:text-lg font-bold">{store.items?.length || 0}</p>
            <p className="text-gray-500 text-xs">Items</p>
          </div>
          <div className="text-center">
            <p className="text-indigo-600 text-base sm:text-lg font-bold">{store.menuDetails?.numberOfItems || 0}</p>
            <p className="text-gray-500 text-xs">Stock</p>
          </div>
        </div>

        {/* Timing */}
        <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{store.menuDetails?.openingTime || '--:--'}</span>
          </div>
          <div className="text-gray-400">to</div>
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{store.menuDetails?.closingTime || '--:--'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function StoresPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [stats, setStats] = useState({
    totalStores: 0,
    totalCategories: 0,
    totalItems: 0,
    totalStock: 0
  });

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchStores();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/store/all`);
      if (response.data.success) {
        const storesData = response.data.stores || [];
        setStores(storesData);
        
        const totalCategories = storesData.reduce((sum, store) => sum + (store.categories?.length || 0), 0);
        const totalItems = storesData.reduce((sum, store) => sum + (store.items?.length || 0), 0);
        const totalStock = storesData.reduce((sum, store) => sum + (parseInt(store.menuDetails?.numberOfItems) || 0), 0);
        
        setStats({
          totalStores: storesData.length,
          totalCategories: totalCategories,
          totalItems: totalItems,
          totalStock: totalStock
        });
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const exportData = stores.map(store => ({
      'Store ID': store._id,
      'Company Name': store.storeInfo?.companyName || 'N/A',
      'Store Type': store.storeInfo?.type || 'N/A',
      'Owner Name': store.storeInfo?.fullName || 'N/A',
      'Phone': store.storeInfo?.phone || 'N/A',
      'Email': store.storeInfo?.email || 'N/A',
      'Address': store.storeInfo?.fullAddress || 'N/A',
      'City': store.storeInfo?.city || 'N/A',
      'State': store.storeInfo?.state || 'N/A',
      'Pincode': store.storeInfo?.pincode || 'N/A',
      'Categories': store.categories?.map(c => c.name).join(', ') || 'N/A',
      'Total Items': store.items?.length || 0,
      'Total Stock': store.menuDetails?.numberOfItems || 0,
      'Opening Time': store.menuDetails?.openingTime || 'N/A',
      'Closing Time': store.menuDetails?.closingTime || 'N/A',
      'GST Number': store.otherDetails?.gstinNumber || 'N/A',
      'Created At': formatDate(store.createdAt),
      'Updated At': formatDate(store.updatedAt)
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stores');
    const fileName = `stores_export_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const filteredStores = stores.filter(store => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      store.storeInfo?.companyName?.toLowerCase().includes(searchLower) ||
      store.storeInfo?.fullName?.toLowerCase().includes(searchLower) ||
      store.storeInfo?.phone?.includes(searchTerm) ||
      store.storeInfo?.email?.toLowerCase().includes(searchLower) ||
      store.storeInfo?.city?.toLowerCase().includes(searchLower)
    );
  });

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
      
      <div 
        className={`transition-all duration-300 pt-20 ${
          !isMobile && isSidebarOpen ? 'ml-64' : !isMobile && !isSidebarOpen ? 'ml-20' : 'ml-0'
        }`}
      >
        <div className="px-4 sm:px-6 py-4 sm:py-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <Store className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Stores</h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-1">Manage all registered stores and their menus</p>
              </div>
            </div>
          </div>

          {/* Statistics Cards - Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Total Stores</p>
                  <p className="text-gray-900 text-xl sm:text-2xl font-bold mt-1">{stats.totalStores}</p>
                </div>
                <div className="p-2 sm:p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <Store className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Categories</p>
                  <p className="text-gray-900 text-xl sm:text-2xl font-bold mt-1">{stats.totalCategories}</p>
                </div>
                <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Menu Items</p>
                  <p className="text-gray-900 text-xl sm:text-2xl font-bold mt-1">{stats.totalItems}</p>
                </div>
                <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Total Stock</p>
                  <p className="text-gray-900 text-xl sm:text-2xl font-bold mt-1">{stats.totalStock}</p>
                </div>
                <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
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
                    placeholder="Search by store name, owner, phone, email or city..."
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

          {/* Stores Grid - 2 columns on mobile, 3 on desktop */}
          {filteredStores.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl sm:rounded-2xl border border-gray-200">
              <Store className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No stores found</p>
              {searchTerm && (
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredStores.map((store) => (
                <StoreCard
                  key={store._id}
                  store={store}
                  onViewDetails={setSelectedStore}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Store Details Modal */}
      <AnimatePresence>
        {selectedStore && (
          <StoreDetailsModal store={selectedStore} onClose={() => setSelectedStore(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
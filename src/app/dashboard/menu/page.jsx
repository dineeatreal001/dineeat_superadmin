"use client";

import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "@/component/Sidebar/Sidebar";
import Navbar from "@/component/Navbar/Navbar";
import { Search, X, MapPin, Phone, Store as StoreIcon, Utensils } from "lucide-react";
import { authFetch } from "@/lib/authClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL; // e.g. http://localhost:3085/api

const StoresPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [stores, setStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [storeSearch, setStoreSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [selectedStore, setSelectedStore] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [menuSearch, setMenuSearch] = useState("");
  const [vegFilter, setVegFilter] = useState("");

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ---- Fetch stores (debounced on search/filter change) ----
  const fetchStores = useCallback(async () => {
    setLoadingStores(true);
    try {
      const params = new URLSearchParams();
      if (storeSearch) params.set("search", storeSearch);
      if (typeFilter) params.set("type", typeFilter);

      // NOTE: backend router is mounted at /api/store (singular) with
      // superadmin routes under /admin/*  ->  /api/store/admin/all
      const res = await authFetch(`${API_BASE}/store/admin/all?${params.toString()}`);
      const json = await res.json();
      if (json.success) setStores(json.data);
    } catch (err) {
      console.error("Failed to fetch stores:", err);
    } finally {
      setLoadingStores(false);
    }
  }, [storeSearch, typeFilter]);

  useEffect(() => {
    const debounce = setTimeout(fetchStores, 350);
    return () => clearTimeout(debounce);
  }, [fetchStores]);

  // ---- Fetch menu items for a selected store ----
  const fetchMenuItems = useCallback(async () => {
    if (!selectedStore) return;
    setLoadingMenu(true);
    try {
      const params = new URLSearchParams();
      if (menuSearch) params.set("search", menuSearch);
      if (vegFilter) params.set("veg", vegFilter);

      const res = await authFetch(
        `${API_BASE}/store/admin/${selectedStore._id}/menu-items?${params.toString()}`
      );
      const json = await res.json();
      if (json.success) setMenuItems(json.data);
    } catch (err) {
      console.error("Failed to fetch menu items:", err);
    } finally {
      setLoadingMenu(false);
    }
  }, [selectedStore, menuSearch, vegFilter]);

  useEffect(() => {
    const debounce = setTimeout(fetchMenuItems, 300);
    return () => clearTimeout(debounce);
  }, [fetchMenuItems]);

  const openStore = (store) => {
    setSelectedStore(store);
    setMenuSearch("");
    setVegFilter("");
  };

  const closeMenuPanel = () => {
    setSelectedStore(null);
    setMenuItems([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isSidebarOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />

      <div
        className={`transition-all duration-300 mt-16 ${
          !isMobile && (isSidebarOpen ? "ml-64" : "ml-20")
        }`}
      >
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Stores</h1>

            <div className="flex flex-col sm:flex-row gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={storeSearch}
                  onChange={(e) => setStoreSearch(e.target.value)}
                  placeholder="Search by name, city, phone..."
                  className="pl-9 pr-3 py-2 w-full sm:w-72 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Type filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="restaurant">Restaurant</option>
                <option value="hotel">Hotel</option>
                <option value="cafe">Cafe</option>
              </select>
            </div>
          </div>

          {/* Store Grid */}
          {loadingStores ? (
            <div className="text-center py-16 text-gray-500 text-sm">Loading stores...</div>
          ) : stores.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-sm">No stores found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {stores.map((store) => (
                <button
                  key={store._id}
                  onClick={() => openStore(store)}
                  className="text-left bg-white rounded-xl border border-gray-200 p-4 md:p-5 hover:shadow-lg hover:border-blue-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
                      <StoreIcon className="w-5 h-5" />
                    </div>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full capitalize ${
                        store.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {store.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="font-semibold text-gray-800 text-sm md:text-base truncate">
                    {store.storeInfo?.companyName}
                  </p>
                  <p className="text-xs text-gray-500 mb-2 capitalize">{store.storeInfo?.type}</p>

                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{store.storeInfo?.city}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{store.storeInfo?.phone}</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">{store.plan || "Basic Plan"}</span>
                    <span className="text-xs font-medium text-blue-600">View Menu →</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Menu Items Slide-over Panel */}
      {selectedStore && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeMenuPanel}
          />
          <div className="relative bg-gray-50 w-full sm:w-[520px] h-full shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-5 z-10">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-semibold text-gray-800 text-base md:text-lg">
                    {selectedStore.storeInfo?.companyName}
                  </h2>
                  <p className="text-xs text-gray-500 capitalize">
                    {selectedStore.storeInfo?.type} · {selectedStore.storeInfo?.city}
                  </p>
                </div>
                <button
                  onClick={closeMenuPanel}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Search menu items..."
                    className="pl-9 pr-3 py-2 w-full rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={vegFilter}
                  onChange={(e) => setVegFilter(e.target.value)}
                  className="px-2 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="true">Veg</option>
                  <option value="false">Non-Veg</option>
                </select>
              </div>
            </div>

            <div className="p-4 md:p-5 space-y-3">
              {loadingMenu ? (
                <div className="text-center py-10 text-gray-500 text-sm">Loading menu...</div>
              ) : menuItems.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm flex flex-col items-center gap-2">
                  <Utensils className="w-6 h-6 text-gray-300" />
                  No menu items found.
                </div>
              ) : (
                menuItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl border border-gray-200 p-3 md:p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
                  >
                    <div className="text-2xl">{item.emoji || "🍽️"}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-800 text-sm truncate">{item.name}</p>
                        <span
                          className={`w-2.5 h-2.5 rounded-sm border ${
                            item.veg
                              ? "bg-green-500 border-green-600"
                              : "bg-red-500 border-red-600"
                          }`}
                        />
                      </div>
                      {item.category && (
                        <p className="text-xs text-gray-400">{item.category}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800 text-sm">₹{item.price}</p>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          item.available
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoresPage;
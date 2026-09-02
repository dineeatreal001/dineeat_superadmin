"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import {
  Database, Download, Loader2, ChevronDown, FileSpreadsheet,
  FileJson, Receipt, UtensilsCrossed, Store as StoreIcon
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3085/api';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('superAdminToken') : null;
  return { headers: { Authorization: `Bearer ${token}` } };
};

const BackupRestore = () => {
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [backupData, setBackupData] = useState(null);
  const [loadingBackup, setLoadingBackup] = useState(false);
  const [loadingStores, setLoadingStores] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/store/admin/all`, getAuthHeaders());
      if (res.data.success) setStores(res.data.data);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    } finally {
      setLoadingStores(false);
    }
  };

  const handleSelectStore = async (storeId) => {
    setSelectedStoreId(storeId);
    setBackupData(null);
    if (!storeId) return;

    setLoadingBackup(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/backup/store/${storeId}`, getAuthHeaders());
      if (res.data.success) setBackupData(res.data.data);
    } catch (err) {
      console.error('Failed to fetch backup data:', err);
      alert(err.response?.data?.message || 'Failed to load backup data');
    } finally {
      setLoadingBackup(false);
    }
  };

  const exportAsJSON = () => {
    if (!backupData) return;
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${backupData.store.companyName || 'store'}_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsExcel = () => {
    if (!backupData) return;
    const wb = XLSX.utils.book_new();

    const menuSheet = XLSX.utils.json_to_sheet(
      backupData.menuItems.map((item) => ({
        Name: item.name,
        Category: item.category,
        Price: item.price,
        Veg: item.veg ? 'Yes' : 'No',
        Available: item.available ? 'Yes' : 'No',
        'Total Orders': item.totalOrders,
        'Created At': item.createdAt,
      }))
    );
    XLSX.utils.book_append_sheet(wb, menuSheet, 'Menu Items');

    const billsSheet = XLSX.utils.json_to_sheet(
      backupData.bills.map((bill) => ({ ...bill }))
    );
    XLSX.utils.book_append_sheet(wb, billsSheet, 'Bills');

    XLSX.writeFile(wb, `${backupData.store.companyName || 'store'}_backup_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-800">Backup & Restore</h2>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Store</label>
        <div className="relative">
          <select
            value={selectedStoreId}
            onChange={(e) => handleSelectStore(e.target.value)}
            disabled={loadingStores}
            className="w-full appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <option value="">
              {loadingStores ? 'Loading stores...' : 'Choose a store to view backup...'}
            </option>
            {stores.map((store) => (
              <option key={store._id} value={store._id}>
                {store.storeInfo?.companyName} — {store.storeInfo?.city}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {loadingBackup && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        </div>
      )}

      {backupData && !loadingBackup && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-lg">
            <StoreIcon className="w-4 h-4 text-indigo-600" />
            <p className="text-sm font-medium text-indigo-900">{backupData.store.companyName}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <UtensilsCrossed className="w-4 h-4 text-gray-500" />
                <p className="text-xs text-gray-500">Menu Items</p>
              </div>
              <p className="text-xl font-bold text-gray-800">{backupData.counts.menuItems}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Receipt className="w-4 h-4 text-gray-500" />
                <p className="text-xs text-gray-500">Bills</p>
              </div>
              <p className="text-xl font-bold text-gray-800">{backupData.counts.bills}</p>
            </div>
          </div>

          {backupData.menuItems.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Menu Items Preview</p>
              <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto divide-y divide-gray-100">
                {backupData.menuItems.slice(0, 5).map((item) => (
                  <div key={item._id} className="flex justify-between items-center p-2.5 text-sm">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="font-medium text-gray-800">₹{item.price}</span>
                  </div>
                ))}
                {backupData.menuItems.length > 5 && (
                  <p className="text-xs text-gray-400 p-2.5">+{backupData.menuItems.length - 5} more items</p>
                )}
              </div>
            </div>
          )}

          {backupData.bills.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Bills Preview</p>
              <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto divide-y divide-gray-100">
                {backupData.bills.slice(0, 5).map((bill) => (
                  <div key={bill._id} className="flex justify-between items-center p-2.5 text-sm">
                    <span className="text-gray-700">{bill.billNumber || bill._id}</span>
                    <span className="font-medium text-gray-800">₹{bill.totalAmount || bill.amount || 0}</span>
                  </div>
                ))}
                {backupData.bills.length > 5 && (
                  <p className="text-xs text-gray-400 p-2.5">+{backupData.bills.length - 5} more bills</p>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={exportAsExcel}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export as Excel
            </button>
            <button
              onClick={exportAsJSON}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-800 transition"
            >
              <FileJson className="w-4 h-4" />
              Export as JSON
            </button>
          </div>
        </div>
      )}

      {!selectedStoreId && !loadingBackup && (
        <div className="text-center py-8 text-gray-400 text-sm">
          <Download className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          Select a store above to preview and export its backup data.
        </div>
      )}
    </div>
  );
};

export default BackupRestore;
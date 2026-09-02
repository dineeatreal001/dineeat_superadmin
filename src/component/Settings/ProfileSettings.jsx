"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  User, Lock, Loader2, Eye, EyeOff, CheckCircle
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3085/api';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('superAdminToken') : null;
  return { headers: { Authorization: `Bearer ${token}` } };
};

const ProfileSettings = () => {
  const [superAdmin, setSuperAdmin] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/superadmin-auth/me`, getAuthHeaders());
      if (res.data.success) setSuperAdmin(res.data.superAdmin);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await axios.put(
        `${API_BASE_URL}/superadmin-auth/change-password`,
        { currentPassword, newPassword },
        getAuthHeaders()
      );
      if (res.data.success) {
        setPasswordSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-800">Superadmin Profile</h2>
      </div>

      {loadingProfile ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={superAdmin?.name || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={superAdmin?.email || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <input
              type="text"
              value={superAdmin?.role || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 capitalize"
            />
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-4 h-4 text-indigo-600" />
          <h3 className="font-semibold text-gray-800">Change Password</h3>
        </div>

        {passwordError && (
          <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {passwordError}
          </div>
        )}
        {passwordSuccess && (
          <div className="mb-3 p-2.5 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {passwordSuccess}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3">
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
              required
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password (min. 8 characters)"
              required
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={changingPassword}
            className="w-full py-2 px-4 bg-gradient-to-b from-blue-400 to-indigo-500 text-white font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
          >
            {changingPassword ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
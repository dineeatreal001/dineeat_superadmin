"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const Navbar = ({ onMenuClick, isSidebarOpen }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const notificationRef = useRef(null);

  // Sample notifications data
  const notifications = [
    { id: 1, title: 'New Store Added', message: 'The Grand Hotel has been added successfully', time: '2 min ago', read: false },
    { id: 2, title: 'Subscription Expiring', message: 'Coffee Brew subscription expires in 5 days', time: '1 hour ago', read: false },
    { id: 3, title: 'Payment Received', message: '₹12,500 received from Spice Garden', time: '3 hours ago', read: true },
    { id: 4, title: 'New Ticket Raised', message: 'Payment failed issue reported by Royal Palace', time: '5 hours ago', read: false },
    { id: 5, title: 'System Update', message: 'New features are available for your dashboard', time: '1 day ago', read: true },
  ];

  // Check for mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close notification modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddStore = () => {
    if (pathname !== '/dashboard/add-store') {
      router.push('/dashboard/add-store');
    }
  };

  const handleSettings = () => {
    if (pathname !== '/dashboard/settings') {
      router.push('/dashboard/settings');
    }
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleProfileClick = () => {
    if (pathname !== '/dashboard/profile') {
      router.push('/dashboard/profile');
    }
  };

  const handleViewAllNotifications = () => {
    setIsNotificationOpen(false);
    if (pathname !== '/dashboard/notifications') {
      router.push('/dashboard/notifications');
    }
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  return (
    <div 
      className="bg-white border-b border-gray-200 px-3 md:px-6 py-3 md:py-4 fixed top-0 right-0 left-0 z-20 transition-all duration-300" 
      style={{ left: !isMobile && isSidebarOpen ? '16rem' : !isMobile && !isSidebarOpen ? '5rem' : '0' }}
    >
      <div className="flex items-center justify-between">
        {/* Left side - Hamburger Menu and Logo */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Hamburger Menu Icon */}
          <button 
            onClick={onMenuClick}
            className="p-1.5 md:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

        
        </div>

        {/* Right side - Buttons */}
        <div className="flex items-center gap-1 md:gap-3">
          {/* Add Store Button - Hide text on mobile */}
          <button 
            onClick={handleAddStore}
            className="px-2 md:px-4 py-1.5 md:py-2 cursor-pointer bg-gradient-to-b from-blue-400 to-indigo-500 text-white text-xs md:text-sm font-medium rounded-lg hover:opacity-90 transition-all"
          >
            <span className="hidden sm:inline">+ Add Store</span>
            <span className="sm:hidden">+</span>
          </button>

          {/* Settings Button */}
          <button 
            onClick={handleSettings}
            className="p-1.5 md:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* Notification Button */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={handleNotificationClick}
              className="p-1.5 md:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {getUnreadCount() > 0 && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Notification Dropdown Modal - Responsive width */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-72 md:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-3 md:p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 text-sm md:text-base">Notifications</h3>
                    <button 
                      onClick={() => setIsNotificationOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="max-h-80 md:max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-3 md:p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex gap-2 md:gap-3">
                          <div className="flex-1">
                            <p className="text-xs md:text-sm font-medium text-gray-800">{notification.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1 md:mt-2">{notification.time}</p>
                          </div>
                          {!notification.read && (
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full mt-1 md:mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-2 md:p-3 border-t border-gray-200">
                  <button 
                    onClick={handleViewAllNotifications}
                    className="w-full text-center text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Button with Initials */}
          <button 
            onClick={handleProfileClick}
            className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-gradient-to-b from-blue-400 to-indigo-500 text-white font-semibold rounded-full hover:opacity-90 transition-all text-sm md:text-base"
          >
            DE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
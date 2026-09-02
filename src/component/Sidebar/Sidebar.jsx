"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

const Sidebar = ({ isSidebarOpen, onClose, onHoverChange }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { name: 'Home', icon: '🏠', path: '/dashboard' },
    { name: 'Add Store', icon: '📦', path: '/dashboard/add-store' },
    { name: 'Manage Store', icon: '🔄', path: '/dashboard/manage-store' },
    { name: 'Menu', icon: '📋', path: '/dashboard/menu' },
    { name: 'Subscription', icon: '💰', path: '/dashboard/subscription' },
    { name: 'Complaint Box', icon: '🚚', path: '/dashboard/complaints' },
  ];

  const insightItems = [
    { name: 'Settings', icon: '⚖️', path: '/dashboard/settings' },
    { name: 'Configurations', icon: '⚙️', path: '/dashboard/configure' },
  ];

  // For mobile: sidebar is hidden by default and opens as an overlay
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
            onClick={onClose}
          />
        )}
        
        {/* Mobile Sidebar */}
        <div 
          className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 transition-all duration-300 overflow-y-auto ${
            isSidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'
          }`}
        >
          <div className="p-6">
            {/* Close button for mobile */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="w-8 h-8" />
                <span className="font-bold text-xl text-gray-800">DineEat</span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <nav className="space-y-6">
              {/* Home Section */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Home
                </h3>
                <div className="space-y-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.path}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        pathname === item.path
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Insights Section */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Insights
                </h3>
                <div className="space-y-1">
                  {insightItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.path}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        pathname === item.path
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Logout */}
            <div className="mt-8 pt-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop version with hover functionality
  return (
    <div 
      className={`bg-white border-r border-gray-200 h-screen fixed top-0 left-0 z-50 transition-all duration-300 ${
        isSidebarOpen || isHovered ? 'w-64' : 'w-20'
      }`}
      onMouseEnter={() => {
        setIsHovered(true);
        if (onHoverChange) onHoverChange(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (onHoverChange) onHoverChange(false);
      }}
    >
      <div className="p-6">
        {/* Logo Section - Hidden when sidebar is minimized */}
        {(isSidebarOpen || isHovered) && (
          <div className="flex items-center gap-2 mb-8">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            <span className="font-bold text-xl text-gray-800">DineEat</span>
          </div>
        )}

        {/* Show only icon when minimized */}
        {!isSidebarOpen && !isHovered && (
          <div className="flex justify-center mb-8">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-6">
          {/* Home Section */}
          <div>
            {(isSidebarOpen || isHovered) && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Home
              </h3>
            )}
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    pathname === item.path
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  } ${!isSidebarOpen && !isHovered && 'justify-center'}`}
                  title={!isSidebarOpen && !isHovered ? item.name : ''}
                >
                  <span className="text-xl">{item.icon}</span>
                  {(isSidebarOpen || isHovered) && <span>{item.name}</span>}
                </Link>
              ))}
            </div>
          </div>

          {/* Insights Section */}
          <div>
            {(isSidebarOpen || isHovered) && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Insights
              </h3>
            )}
            <div className="space-y-1">
              {insightItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    pathname === item.path
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  } ${!isSidebarOpen && !isHovered && 'justify-center'}`}
                  title={!isSidebarOpen && !isHovered ? item.name : ''}
                >
                  <span className="text-xl">{item.icon}</span>
                  {(isSidebarOpen || isHovered) && <span>{item.name}</span>}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Logout */}
        <div className="mt-8 pt-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 bg-red-50 hover:bg-red-100 transition-colors ${
              !isSidebarOpen && !isHovered && 'justify-center'
            }`}
            title={!isSidebarOpen && !isHovered ? 'Logout' : ''}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {(isSidebarOpen || isHovered) && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
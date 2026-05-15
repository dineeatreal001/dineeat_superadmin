"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = ({ isSidebarOpen, onClose }) => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

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
    { name: 'Forward Order', icon: '📦', path: '/dashboard/forward-order' },
    { name: 'Reverse Order', icon: '🔄', path: '/dashboard/reverse-order' },
    { name: 'NDR', icon: '📋', path: '/dashboard/ndr' },
    { name: 'Billing', icon: '💰', path: '/dashboard/billing' },
    { name: 'Post Shipping', icon: '🚚', path: '/dashboard/post-shipping' },
  ];

  const insightItems = [
    { name: 'Weight Module', icon: '⚖️', path: '/dashboard/weight-module' },
    { name: 'Configure', icon: '⚙️', path: '/dashboard/configure' },
    { name: 'Tools', icon: '🔧', path: '/dashboard/tools' },
  ];

  // For mobile: sidebar is hidden by default and opens as an overlay
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300"
            onClick={onClose}
          />
        )}
        
        {/* Mobile Sidebar */}
        <div 
          className={`fixed top-0 left-0 h-full bg-white shadow-xl z-30 transition-all duration-300 overflow-y-auto ${
            isSidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'
          }`}
        >
          <div className="p-6">
            {/* Close button for mobile */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <img src="/Loading.svg" alt="Logo" className="w-8 h-8" />
                <span className="font-bold text-xl text-gray-800">OrderLoad</span>
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
          </div>
        </div>
      </>
    );
  }

  // Desktop version
  return (
    <div 
      className={`bg-white border-r border-gray-200 h-screen fixed top-0 left-0 z-10 transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="p-6">
        {/* Logo Section - Hidden when sidebar is minimized */}
        {isSidebarOpen && (
          <div className="flex items-center gap-2 mb-8">
            <img src="/Loading.svg" alt="Logo" className="w-8 h-8" />
            <span className="font-bold text-xl text-gray-800">OrderLoad</span>
          </div>
        )}

        {/* Show only icon when minimized */}
        {!isSidebarOpen && (
          <div className="flex justify-center mb-8">
            <img src="/Loading.svg" alt="Logo" className="w-8 h-8" />
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-6">
          {/* Home Section */}
          <div>
            {isSidebarOpen && (
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
                  } ${!isSidebarOpen && 'justify-center'}`}
                  title={!isSidebarOpen ? item.name : ''}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isSidebarOpen && <span>{item.name}</span>}
                </Link>
              ))}
            </div>
          </div>

          {/* Insights Section */}
          <div>
            {isSidebarOpen && (
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
                  } ${!isSidebarOpen && 'justify-center'}`}
                  title={!isSidebarOpen ? item.name : ''}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isSidebarOpen && <span>{item.name}</span>}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
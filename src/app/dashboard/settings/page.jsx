"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/component/Sidebar/Sidebar';
import Navbar from '@/component/Navbar/Navbar';
import ProfileSettings from '@/component/Settings/ProfileSettings';
import BackupRestore from '@/component/Settings/BackupRestore';
import { ArrowLeft, User, Database, ChevronRight } from 'lucide-react';

const SECTIONS = [
  {
    id: 'profile',
    title: 'Superadmin Profile',
    description: 'View your account details and change your password',
    icon: User,
    color: 'from-blue-400 to-indigo-500',
  },
  {
    id: 'backup',
    title: 'Backup & Restoration',
    description: 'View and export store data — menus, bills, and more',
    icon: Database,
    color: 'from-emerald-400 to-teal-500',
  },
];

const SettingsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState(null); // null = landing list

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

  const activeMeta = SECTIONS.find((s) => s.id === activeSection);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isSidebarOpen={isSidebarOpen} onClose={() => isMobile && setIsSidebarOpen(false)} />
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />

      <div
        className={`transition-all duration-300 pt-20 ${
          !isMobile && isSidebarOpen ? 'ml-64' : !isMobile && !isSidebarOpen ? 'ml-20' : 'ml-0'
        }`}
      >
        <div className="p-4 md:p-6 max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            {activeSection && (
              <button
                onClick={() => setActiveSection(null)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {activeMeta ? activeMeta.title : 'Settings'}
              </h1>
              {!activeSection && (
                <p className="text-sm text-gray-500 mt-0.5">Manage your account and platform data</p>
              )}
            </div>
          </div>

          {/* Landing list of section cards */}
          {!activeSection && (
            <div className="space-y-3">
              {SECTIONS.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className="w-full flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition text-left"
                  >
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800">{section.title}</p>
                      <p className="text-sm text-gray-500 truncate">{section.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Drill-down content */}
          {activeSection === 'profile' && <ProfileSettings />}
          {activeSection === 'backup' && <BackupRestore />}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
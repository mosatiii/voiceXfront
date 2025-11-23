/**
 * Main application layout
 * Provides sidebar navigation and content area for protected routes
 */

import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useUIStore } from '@/store/uiStore';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

export default function AppLayout() {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const closeSidebar = useUIStore((state) => state.closeSidebar);

  // Force close sidebar on desktop
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isSidebarOpen) {
        closeSidebar();
      }
    };
    
    window.addEventListener('resize', handleResize);
    // Initial check
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen, closeSidebar]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Desktop (always visible) */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <Sidebar />
      </aside>

      {/* Sidebar - Mobile (overlay) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={closeSidebar}
            />

            {/* Mobile Sidebar */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden"
            >
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


/**
 * Sidebar navigation component
 * Shows main navigation links with icons and active states
 */

import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Phone,
  MessageSquare,
  PhoneCall,
  CreditCard,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/hooks/useAuth';
import { useUIStore } from '@/store/uiStore';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/numbers', label: 'Phone Numbers', icon: Phone },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
  { to: '/calls', label: 'Calls', icon: PhoneCall },
  { to: '/billing', label: 'Billing', icon: CreditCard },
];

export function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const closeSidebar = useUIStore((state) => state.closeSidebar);

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <div className="flex h-full w-full flex-col bg-white border-r border-gray-200 shadow-sm">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-gray-200">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
          <Phone className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          VoiceX
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110' : ''
                  }`}
                />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-200 p-4 space-y-3">
        {/* User Info */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.email || 'User'}
            </p>
            <p className="text-xs text-gray-500">Free Plan</p>
          </div>
        </div>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          disabled={logout.isPending}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="w-5 h-5" />
          <span>{logout.isPending ? 'Logging out...' : 'Logout'}</span>
        </motion.button>
      </div>
    </div>
  );
}


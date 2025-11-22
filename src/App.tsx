/**
 * Main App component
 * Sets up routing and global providers
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useSocket } from '@/hooks/useSocket';
import Confetti from 'react-confetti';
import { useUIStore } from '@/store/uiStore';

// Auth pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';

// Main app layout
import AppLayout from '@/components/layout/AppLayout';

// Pages (lazy loaded for performance)
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const PhoneNumbers = lazy(() => import('@/pages/PhoneNumbers'));
const PhoneNumberSearch = lazy(() => import('@/pages/PhoneNumberSearch'));
const Messages = lazy(() => import('@/pages/Messages'));
const Calls = lazy(() => import('@/pages/Calls'));
const Billing = lazy(() => import('@/pages/Billing'));

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );
}

function App() {
  // Initialize Socket.io connection (only when authenticated)
  useSocket();
  
  // Get confetti state
  const showConfetti = useUIStore((state) => state.showConfetti);

  return (
    <BrowserRouter>
      {/* Global confetti celebration */}
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      {/* Toast notifications */}
      <Toaster position="top-right" richColors />

      {/* Routes */}
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes - wrapped in AppLayout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="numbers"
            element={
              <Suspense fallback={<PageLoader />}>
                <PhoneNumbers />
              </Suspense>
            }
          />
          <Route
            path="numbers/search"
            element={
              <Suspense fallback={<PageLoader />}>
                <PhoneNumberSearch />
              </Suspense>
            }
          />
          <Route
            path="messages"
            element={
              <Suspense fallback={<PageLoader />}>
                <Messages />
              </Suspense>
            }
          />
          <Route
            path="calls"
            element={
              <Suspense fallback={<PageLoader />}>
                <Calls />
              </Suspense>
            }
          />
          <Route
            path="billing"
            element={
              <Suspense fallback={<PageLoader />}>
                <Billing />
              </Suspense>
            }
          />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

/**
 * Zustand store for UI state
 * Manages modals, notifications, and other UI-related state
 */

import { create } from 'zustand';

interface UIState {
  // Mobile sidebar state
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;

  // Incoming call modal
  incomingCall: {
    callId: string;
    from: string;
    phoneNumberId: string;
  } | null;
  setIncomingCall: (call: UIState['incomingCall']) => void;
  clearIncomingCall: () => void;

  // Active call state
  activeCall: {
    callId: string;
    status: 'connecting' | 'active' | 'ended';
    duration: number;
    isMuted: boolean;
  } | null;
  setActiveCall: (call: UIState['activeCall']) => void;
  updateCallDuration: (duration: number) => void;
  toggleMute: () => void;
  clearActiveCall: () => void;

  // Confetti celebration
  showConfetti: boolean;
  triggerConfetti: () => void;
  hideConfetti: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Sidebar
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),

  // Incoming call
  incomingCall: null,
  setIncomingCall: (call) => set({ incomingCall: call }),
  clearIncomingCall: () => set({ incomingCall: null }),

  // Active call
  activeCall: null,
  setActiveCall: (call) => set({ activeCall: call }),
  updateCallDuration: (duration) =>
    set((state) =>
      state.activeCall ? { activeCall: { ...state.activeCall, duration } } : {}
    ),
  toggleMute: () =>
    set((state) =>
      state.activeCall
        ? { activeCall: { ...state.activeCall, isMuted: !state.activeCall.isMuted } }
        : {}
    ),
  clearActiveCall: () => set({ activeCall: null }),

  // Confetti
  showConfetti: false,
  triggerConfetti: () => {
    set({ showConfetti: true });
    // Auto-hide after 5 seconds
    setTimeout(() => {
      set({ showConfetti: false });
    }, 5000);
  },
  hideConfetti: () => set({ showConfetti: false }),
}));


/**
 * Socket.io connection hook for real-time events
 */

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { env } from '@/config/env';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { SOCKET_EVENTS } from '@/types/socket';
import type { MessageNewEvent, CallIncomingEvent } from '@/types/socket';

/**
 * Custom hook to manage Socket.io connection
 * Handles authentication, reconnection, and event listeners
 */
export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setIncomingCall = useUIStore((state) => state.setIncomingCall);

  useEffect(() => {
    // Only connect if authenticated
    if (!isAuthenticated || !accessToken) {
      return;
    }

    // Create socket connection
    const socket = io(env.wsUrl, {
      auth: {
        token: accessToken,
      },
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on(SOCKET_EVENTS.CONNECTED, () => {
      // Silently handle connection (reduce console noise)
      // console.log('Socket connected');
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      // Silently handle disconnection (reduce console noise)
      // console.log('Socket disconnected');
    });

    socket.on(SOCKET_EVENTS.ERROR, (error) => {
      console.error('Socket error:', error);
    });

    // Message event handlers
    socket.on(SOCKET_EVENTS.MESSAGE_NEW, (data: MessageNewEvent) => {
      console.log('New message received:', data);

      // Update messages cache
      queryClient.invalidateQueries({ queryKey: ['messages'] });

      // Show toast notification for inbound messages
      if (data.message.direction === 'inbound') {
        toast.info(`New message from ${data.message.from}`, {
          description: data.message.body.substring(0, 50) + (data.message.body.length > 50 ? '...' : ''),
        });
      }
    });

    socket.on(SOCKET_EVENTS.MESSAGE_STATUS, (data) => {
      console.log('Message status update:', data);
      
      // Update messages cache
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    });

    // Call event handlers
    socket.on(SOCKET_EVENTS.CALL_INCOMING, (data: CallIncomingEvent) => {
      console.log('Incoming call:', data);

      // Show incoming call modal
      setIncomingCall({
        callId: data.call.id,
        from: data.call.from,
        phoneNumberId: data.call.phoneNumberId,
      });

      // Play ringtone (if implemented)
      // playRingtone();
    });

    socket.on(SOCKET_EVENTS.CALL_STATUS, (data) => {
      console.log('Call status update:', data);
      
      // Update calls cache
      queryClient.invalidateQueries({ queryKey: ['calls'] });
    });

    socket.on(SOCKET_EVENTS.CALL_ENDED, (data) => {
      console.log('Call ended:', data);
      
      // Update calls cache
      queryClient.invalidateQueries({ queryKey: ['calls'] });
    });

    // Connect socket
    socket.connect();

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, accessToken, queryClient, setIncomingCall]);

  return socketRef.current;
};


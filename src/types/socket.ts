/**
 * Socket.io event types for real-time communication
 * These types define the structure of WebSocket events
 */

import type { Message, Call } from './models';

// Socket connection events
export interface SocketAuthData {
  token: string;
}

export interface SocketConnectedData {
  userId: string;
  socketId: string;
}

// Message events
export interface MessageNewEvent {
  message: Message;
}

export interface MessageStatusEvent {
  messageId: string;
  status: Message['status'];
  errorMessage?: string;
}

// Call events
export interface CallIncomingEvent {
  call: Call;
}

export interface CallStatusEvent {
  callId: string;
  status: Call['status'];
  duration?: number;
  errorMessage?: string;
}

export interface CallEndedEvent {
  callId: string;
  duration: number;
  endedAt: string;
}

// Event names (for type safety)
export const SOCKET_EVENTS = {
  // Connection
  CONNECTED: 'connected',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  
  // Messages
  MESSAGE_NEW: 'message:new',
  MESSAGE_STATUS: 'message:status',
  
  // Calls
  CALL_INCOMING: 'call:incoming',
  CALL_STATUS: 'call:status',
  CALL_ENDED: 'call:ended',
} as const;

// Type for all socket event handlers
export interface SocketEventHandlers {
  [SOCKET_EVENTS.CONNECTED]: (data: SocketConnectedData) => void;
  [SOCKET_EVENTS.DISCONNECT]: () => void;
  [SOCKET_EVENTS.ERROR]: (error: Error) => void;
  [SOCKET_EVENTS.MESSAGE_NEW]: (data: MessageNewEvent) => void;
  [SOCKET_EVENTS.MESSAGE_STATUS]: (data: MessageStatusEvent) => void;
  [SOCKET_EVENTS.CALL_INCOMING]: (data: CallIncomingEvent) => void;
  [SOCKET_EVENTS.CALL_STATUS]: (data: CallStatusEvent) => void;
  [SOCKET_EVENTS.CALL_ENDED]: (data: CallEndedEvent) => void;
}


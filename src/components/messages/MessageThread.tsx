/**
 * Message Thread Component
 * Displays message conversation with WhatsApp-style bubbles
 */

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCheck, AlertCircle, Clock } from 'lucide-react';
import { formatRelativeTime } from '@/utils/formatters';
import type { Message } from '@/types/models';

interface MessageThreadProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageThread({ messages, isLoading }: MessageThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-green-600" />;
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'failed':
        return <AlertCircle className="w-3 h-3 text-red-600" />;
      default:
        return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
          >
            <div className="h-16 w-64 animate-pulse bg-gray-200 rounded-2xl" />
          </div>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  // Sort messages by time (oldest first)
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
      {sortedMessages.map((message, index) => {
        const isOutbound = message.direction === 'outbound';
        const prevMessage = sortedMessages[index - 1];
        const showTimestamp = !prevMessage || 
          new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() > 5 * 60 * 1000; // 5 min gap

        return (
          <div key={message.id}>
            {/* Timestamp separator */}
            {showTimestamp && (
              <div className="flex justify-center my-4">
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {formatRelativeTime(message.createdAt)}
                </span>
              </div>
            )}

            {/* Message bubble */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] md:max-w-[60%] ${
                  isOutbound
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-md shadow-md'
                    : 'bg-white text-gray-900 rounded-2xl rounded-bl-md shadow-sm border border-gray-100'
                }`}
              >
                <div className="px-4 py-2.5">
                  {/* Message body */}
                  <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                    {message.body}
                  </p>

                  {/* Time and status */}
                  <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                    isOutbound ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    <span>{new Date(message.createdAt).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}</span>
                    {isOutbound && <span className="ml-1">{getStatusIcon(message.status)}</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}


/**
 * Messages Page - Modern messaging interface
 * WhatsApp/iMessage-style UI
 */

import { useState, useEffect } from 'react';
import { MessageSquare, Send, Search, MoreVertical, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MessageThread } from '@/components/messages/MessageThread';
import { SendMessageForm } from '@/components/messages/SendMessageForm';
import { useMyNumbers, useMessages } from '@/hooks/useApi';
import { formatPhoneNumber, formatRelativeTime } from '@/utils/formatters';

type View = 'conversations' | 'send';

export default function Messages() {
  const [selectedNumberId, setSelectedNumberId] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [view, setView] = useState<View>('conversations');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch user's phone numbers
  const { data: numbersData, isLoading: numbersLoading } = useMyNumbers();
  const phoneNumbers = numbersData?.phoneNumbers || [];

  // Auto-select first SMS-capable number (using useEffect to avoid render issues)
  useEffect(() => {
    if (!selectedNumberId && phoneNumbers.length > 0) {
      // Find first active number with SMS capability
      const firstSmsNumber = phoneNumbers.find(
        (n) => n.status === 'active' && n.capabilities?.sms !== false
      );
      if (firstSmsNumber) {
        setSelectedNumberId(firstSmsNumber.id);
      } else if (phoneNumbers[0]) {
        // Fallback to first number if no SMS-capable number found
        setSelectedNumberId(phoneNumbers[0].id);
      }
    }
  }, [selectedNumberId, phoneNumbers]);

  // Fetch messages for selected number
  const { data: messagesData, isLoading: messagesLoading, error: messagesError } = useMessages(
    selectedNumberId ? { phoneNumberId: selectedNumberId, limit: 100 } : { limit: 100 },
    { enabled: !!selectedNumberId } // Only fetch when we have a selected number
  );

  // Extract messages from response - handle different possible response structures
  const messages = messagesData?.messages || 
                   (Array.isArray(messagesData) ? messagesData : []) || 
                   [];

  // Group messages by conversation
  const conversations = messages.reduce((acc, msg) => {
    // Ensure we have valid from/to values
    const contact = msg.direction === 'inbound' ? (msg.from || 'Unknown') : (msg.to || 'Unknown');
    if (!acc[contact]) {
      acc[contact] = [];
    }
    acc[contact].push(msg);
    return acc;
  }, {} as Record<string, typeof messages>);

  // Filter conversations by search
  const filteredConversations = Object.entries(conversations).filter(([contact]) =>
    contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const conversationMessages = selectedConversation ? conversations[selectedConversation] || [] : [];

  if (numbersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (phoneNumbers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Card className="max-w-md p-8 text-center">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Phone Numbers</h3>
          <p className="text-gray-600 mb-6">
            Rent a phone number to start messaging
          </p>
          <Button
            onClick={() => (window.location.href = '/numbers/search')}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Rent Number
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">Send and receive SMS messages</p>
      </div>

      {/* Main Messaging Interface */}
      <Card className="flex-1 flex overflow-hidden border-0 shadow-lg">
        {/* Left Sidebar - Conversations List */}
        <div className={`w-full md:w-96 border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-lg">Conversations</h2>
              <Button
                size="sm"
                onClick={() => {
                  setView('send');
                  setSelectedConversation(null);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Send className="w-4 h-4 mr-1" />
                New
              </Button>
            </div>

            {/* Search */}
            <div className="mt-3 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {/* Show error if API call failed */}
            {messagesError && (
              <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-medium">Failed to load messages</p>
                <p className="text-xs text-red-600 mt-1">Check console for details</p>
                <p className="text-xs text-red-500 mt-2 font-mono">
                  Error: {messagesError instanceof Error ? messagesError.message : String(messagesError)}
                </p>
              </div>
            )}

            {messagesLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse bg-gray-100 rounded-lg" />
                ))}
              </div>
            ) : messages.length > 0 ? (
              filteredConversations.length > 0 ? (
              <div>
                {filteredConversations.map(([contact, msgs]) => {
                  const lastMessage = msgs[msgs.length - 1];
                    // Count unread inbound messages (status is 'received' for inbound)
                  const unreadCount = msgs.filter(
                      (m) => m.direction === 'inbound' && m.status === 'received'
                  ).length;

                  return (
                    <div
                      key={contact}
                      onClick={() => {
                        setSelectedConversation(contact);
                        setView('conversations');
                      }}
                      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedConversation === contact ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {formatPhoneNumber(contact).charAt(1)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-sm truncate">
                              {formatPhoneNumber(contact)}
                            </p>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {lastMessage && formatRelativeTime(lastMessage.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">
                              {lastMessage?.direction === 'outbound' && 'You: '}
                              {lastMessage?.body || 'No messages'}
                            </p>
                            {unreadCount > 0 && (
                              <Badge className="ml-2 bg-blue-600 text-white text-xs">
                                {unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500">No conversations match your search</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {messages.length} message(s) found but filtered out
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSearchQuery('')}
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500">No conversations yet</p>
                <p className="text-sm text-gray-400 mt-1">Send a message to get started</p>
                {messagesError && (
                  <p className="text-xs text-red-500 mt-2">Error loading messages. Check console.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Message Thread or Send Form */}
        <div className={`flex-1 flex flex-col ${!selectedConversation && view !== 'send' ? 'hidden md:flex' : 'flex'}`}>
          {view === 'send' || !selectedConversation ? (
            /* Send New Message */
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setView('conversations')}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Send className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">New Message</h3>
              </div>

              {/* Form */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <SendMessageForm
                  phoneNumbers={phoneNumbers}
                  onSuccess={() => {
                    setView('conversations');
                  }}
                />
              </div>
            </div>
          ) : selectedConversation ? (
            /* Message Thread */
            <div className="flex-1 flex flex-col">
              {/* Thread Header */}
              <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="md:hidden"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {formatPhoneNumber(selectedConversation).charAt(1)}
                  </div>
                  <div>
                    <p className="font-semibold">{formatPhoneNumber(selectedConversation)}</p>
                    <p className="text-xs text-gray-500">{conversationMessages.length} messages</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 bg-gray-50">
                <MessageThread messages={conversationMessages} isLoading={messagesLoading} />
              </div>

              {/* Quick Reply Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageSquare className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">Select a conversation</p>
                <p className="text-sm text-gray-400 mt-1">Choose from the list or start a new message</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

/**
 * Dashboard page
 * Shows overview with stats cards, recent activity, and quick actions
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Phone, MessageSquare, PhoneCall, TrendingUp, Plus, Send, PhoneOutgoing } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMyNumbers, useMessages, useCalls } from '@/hooks/useApi';
import { formatRelativeTime, formatPhoneNumber } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const navigate = useNavigate();

  // Fetch dashboard data
  const { data: numbersData, isLoading: numbersLoading } = useMyNumbers();
  
  // Only fetch messages/calls if we have phone numbers
  // Backend requires phoneNumberId, so we skip if no numbers yet
  const hasNumbers = (numbersData?.phoneNumbers?.length ?? 0) > 0;
  
  const { data: messagesData, isLoading: messagesLoading } = useMessages(
    { limit: 5 },
    { enabled: hasNumbers } // Only fetch if we have numbers
  );
  const { data: callsData, isLoading: callsLoading } = useCalls(
    { limit: 5 },
    { enabled: hasNumbers } // Only fetch if we have numbers
  );

  const stats = [
    {
      title: 'Phone Numbers',
      value: numbersData?.phoneNumbers?.length || 0,
      icon: Phone,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
    },
    {
      title: 'Messages Sent',
      value: messagesData?.messages?.filter((m) => m.direction === 'outbound').length || 0,
      icon: MessageSquare,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
    },
    {
      title: 'Calls Made',
      value: callsData?.calls?.filter((c) => c.direction === 'outbound').length || 0,
      icon: PhoneCall,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
    },
    {
      title: 'Total Activity',
      value: (messagesData?.messages?.length || 0) + (callsData?.calls?.length || 0),
      icon: TrendingUp,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Here's what's happening with your VoiceX account</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-30 pointer-events-none`} />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  {numbersLoading || messagesLoading || callsLoading ? (
                    <div className="h-8 w-16 animate-pulse bg-gray-200 rounded" />
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-700">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2 hover:scale-105 transition-transform"
                onClick={() => navigate('/numbers/search')}
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Rent Number</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2 hover:scale-105 transition-transform"
                onClick={() => navigate('/messages')}
              >
                <Send className="w-5 h-5" />
                <span className="font-medium">Send Message</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2 hover:scale-105 transition-transform"
                onClick={() => navigate('/calls')}
              >
                <PhoneOutgoing className="w-5 h-5" />
                <span className="font-medium">Make Call</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {messagesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 animate-pulse bg-gray-200 rounded-lg" />
                  ))}
                </div>
              ) : messagesData?.messages && messagesData.messages.length > 0 ? (
                <div className="space-y-3">
                  {messagesData.messages.slice(0, 5).map((message) => (
                    <div
                      key={message.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        message.direction === 'inbound' ? 'bg-blue-500' : 'bg-purple-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="font-medium text-sm truncate">
                            {formatPhoneNumber(message.direction === 'inbound' ? message.from : message.to)}
                          </p>
                          <Badge variant={message.status === 'delivered' ? 'default' : 'secondary'} className="text-xs">
                            {message.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{message.body}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatRelativeTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No messages yet</p>
              )}
              <Button
                variant="link"
                className="w-full mt-4"
                onClick={() => navigate('/messages')}
              >
                View all messages →
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Calls */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5" />
                Recent Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              {callsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 animate-pulse bg-gray-200 rounded-lg" />
                  ))}
                </div>
              ) : callsData?.calls && callsData.calls.length > 0 ? (
                <div className="space-y-3">
                  {callsData.calls.slice(0, 5).map((call) => (
                    <div
                      key={call.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        call.direction === 'inbound' ? 'bg-green-500' : 'bg-orange-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="font-medium text-sm truncate">
                            {formatPhoneNumber(call.direction === 'inbound' ? call.from : call.to)}
                          </p>
                          <Badge variant={call.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                            {call.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {call.duration ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : 'No duration'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatRelativeTime(call.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No calls yet</p>
              )}
              <Button
                variant="link"
                className="w-full mt-4"
                onClick={() => navigate('/calls')}
              >
                View all calls →
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}


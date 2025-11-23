/**
 * Call Interface Component
 * UI for active call (timer, mute, hangup)
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mic, MicOff, Volume2, VolumeX, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPhoneNumber } from '@/utils/formatters';
import { useEffect, useState } from 'react';

interface CallInterfaceProps {
  phoneNumber: string;
  status: 'connecting' | 'ringing' | 'active' | 'ended';
  duration: number;
  isMuted: boolean;
  onMute: () => void;
  onHangup: () => void;
}

export function CallInterface({
  phoneNumber,
  status,
  duration,
  isMuted,
  onMute,
  onHangup,
}: CallInterfaceProps) {
  const [pulseAnimation, setPulseAnimation] = useState(true);

  useEffect(() => {
    if (status === 'active') {
      setPulseAnimation(false);
    }
  }, [status]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    switch (status) {
      case 'connecting':
        return 'Connecting...';
      case 'ringing':
        return 'Ringing...';
      case 'active':
        return formatDuration(duration);
      case 'ended':
        return 'Call Ended';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connecting':
        return 'bg-yellow-500';
      case 'ringing':
        return 'bg-blue-500';
      case 'active':
        return 'bg-green-500';
      case 'ended':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4"
      >
        <Card className="w-full max-w-md p-8 border-0 shadow-2xl">
          {/* Contact Info */}
          <div className="text-center mb-8">
            {/* Avatar */}
            <motion.div
              animate={pulseAnimation ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg ${
                status === 'active' ? 'ring-4 ring-green-400' : ''
              }`}
            >
              {formatPhoneNumber(phoneNumber).charAt(1)}
            </motion.div>

            {/* Phone Number */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {formatPhoneNumber(phoneNumber)}
            </h2>

            {/* Status */}
            <div className="flex items-center justify-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
              <p className="text-lg text-gray-600">{getStatusText()}</p>
            </div>
          </div>

          {/* Call Controls */}
          <div className="flex items-center justify-center gap-6 mb-6">
            {/* Mute Button */}
            <Button
              onClick={onMute}
              variant="outline"
              size="lg"
              className={`w-16 h-16 rounded-full ${
                isMuted ? 'bg-red-100 border-red-500' : ''
              }`}
            >
              {isMuted ? (
                <MicOff className="w-6 h-6 text-red-600" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </Button>

            {/* Hangup Button */}
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onHangup}
                className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg"
              >
                <Phone className="w-8 h-8 transform rotate-[135deg]" />
              </Button>
            </motion.div>

            {/* Speaker Button (placeholder) */}
            <Button
              variant="outline"
              size="lg"
              className="w-16 h-16 rounded-full"
              disabled
            >
              <Volume2 className="w-6 h-6 text-gray-400" />
            </Button>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge
              variant={status === 'active' ? 'default' : 'secondary'}
              className="text-sm"
            >
              {status === 'active' ? '🟢 Connected' : '🟡 ' + status}
            </Badge>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}


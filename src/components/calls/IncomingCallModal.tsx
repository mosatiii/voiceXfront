/**
 * Incoming Call Modal Component
 * Popup for incoming calls with accept/reject
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPhoneNumber } from '@/utils/formatters';

interface IncomingCallModalProps {
  phoneNumber: string;
  onAccept: () => void;
  onReject: () => void;
}

export function IncomingCallModal({
  phoneNumber,
  onAccept,
  onReject,
}: IncomingCallModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <Card className="w-full max-w-md p-8 border-0 shadow-2xl bg-white">
            {/* Animated Ring Icon */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, -10, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 mx-auto mb-6 flex items-center justify-center shadow-lg"
            >
              <Phone className="w-12 h-12 text-white" />
            </motion.div>

            {/* Caller Info */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Incoming Call
              </h2>
              <p className="text-xl text-gray-600">
                {formatPhoneNumber(phoneNumber)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {/* Reject */}
              <Button
                onClick={onReject}
                variant="outline"
                className="flex-1 h-14 rounded-full border-2 border-red-500 text-red-600 hover:bg-red-50"
              >
                <PhoneOff className="w-5 h-5 mr-2" />
                Decline
              </Button>

              {/* Accept */}
              <Button
                onClick={onAccept}
                className="flex-1 h-14 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                Accept
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


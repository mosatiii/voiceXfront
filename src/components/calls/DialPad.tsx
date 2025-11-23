/**
 * Dial Pad Component
 * Phone-style keypad for entering numbers
 */

import { motion } from 'framer-motion';
import { Delete } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DialPadProps {
  value: string;
  onChange: (value: string) => void;
  onCall?: () => void;
}

const keys = [
  { digit: '1', letters: '' },
  { digit: '2', letters: 'ABC' },
  { digit: '3', letters: 'DEF' },
  { digit: '4', letters: 'GHI' },
  { digit: '5', letters: 'JKL' },
  { digit: '6', letters: 'MNO' },
  { digit: '7', letters: 'PQRS' },
  { digit: '8', letters: 'TUV' },
  { digit: '9', letters: 'WXYZ' },
  { digit: '*', letters: '' },
  { digit: '0', letters: '+' },
  { digit: '#', letters: '' },
];

export function DialPad({ value, onChange, onCall }: DialPadProps) {
  const handleKeyPress = (digit: string) => {
    onChange(value + digit);
  };

  const handleDelete = () => {
    onChange(value.slice(0, -1));
  };

  const handleLongPressZero = () => {
    if (value.endsWith('0')) {
      onChange(value.slice(0, -1) + '+');
    }
  };

  return (
    <div className="w-full max-w-[280px] mx-auto">
      {/* Display */}
      <div className="mb-2 text-center">
        <div className="text-lg font-semibold min-h-[24px] flex items-center justify-center text-gray-900">
          {value || <span className="text-gray-400 text-sm">Enter number</span>}
        </div>
      </div>

      {/* Dial Pad Grid - Ultra Compact */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        {keys.map(({ digit, letters }, index) => (
          <motion.button
            key={digit}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => handleKeyPress(digit)}
            onContextMenu={(e) => {
              e.preventDefault();
              if (digit === '0') handleLongPressZero();
            }}
            className="h-14 rounded-full bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-400 transition-all flex flex-col items-center justify-center shadow-sm hover:shadow-md active:shadow-inner"
          >
            <span className="text-lg font-semibold text-gray-900">{digit}</span>
            {letters && (
              <span className="text-[9px] text-gray-500 leading-none">{letters}</span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Delete Button */}
      <div className="flex justify-center mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          disabled={!value}
          className="rounded-full w-10 h-10"
        >
          <Delete className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Call Button */}
      {onCall && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={onCall}
            disabled={!value}
            className="w-full h-10 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-full shadow-lg text-sm"
          >
            📞 Call
          </Button>
        </motion.div>
      )}
    </div>
  );
}


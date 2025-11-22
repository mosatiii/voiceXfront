/**
 * Phone Number Search page - Search and rent available numbers
 */

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, Phone, Loader2, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useSearchNumbers, useRentNumber } from '@/hooks/useApi';
import { formatPhoneNumber } from '@/utils/formatters';
import { useUIStore } from '@/store/uiStore';
import type { AvailablePhoneNumber } from '@/types/models';

export default function PhoneNumberSearch() {
  const [areaCode, setAreaCode] = useState('');
  const searchNumbers = useSearchNumbers();
  const rentNumber = useRentNumber();
  const triggerConfetti = useUIStore((state) => state.triggerConfetti);

  const handleSearch = () => {
    if (areaCode.length === 3) {
      searchNumbers.mutate({ areaCode, limit: 20 });
    }
  };

  const handleRent = (phoneNumber: string) => {
    rentNumber.mutate(
      { phoneNumber },
      {
        onSuccess: () => {
          triggerConfetti();
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Search Phone Numbers</h1>
        <p className="text-gray-600 mt-1">Find and rent virtual phone numbers in your area</p>
      </div>

      {/* Search Form */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Search by Area Code</CardTitle>
          <CardDescription>Enter a 3-digit area code to find available numbers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="areaCode">Area Code</Label>
              <Input
                id="areaCode"
                placeholder="415"
                value={areaCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAreaCode(e.target.value.replace(/\D/g, '').slice(0, 3))}
                maxLength={3}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                disabled={areaCode.length !== 3 || searchNumbers.isPending}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {searchNumbers.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Searching...</>
                ) : (
                  <><Search className="w-4 h-4 mr-2" /> Search</>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchNumbers.data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold">
            {searchNumbers.data.numbers.length} numbers found
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchNumbers.data.numbers.map((number: AvailablePhoneNumber, index: number) => (
              <motion.div
                key={number.phoneNumber}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-0 shadow-md hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Phone className="w-8 h-8 p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white" />
                      <div className="flex gap-1">
                        {number.capabilities.sms && <Badge variant="secondary" className="text-xs">SMS</Badge>}
                        {number.capabilities.voice && <Badge variant="secondary" className="text-xs">Voice</Badge>}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{formatPhoneNumber(number.phoneNumber)}</h3>
                    <p className="text-sm text-gray-600 mb-4">{number.locality}, {number.region}</p>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                      onClick={() => handleRent(number.phoneNumber)}
                      disabled={rentNumber.isPending}
                    >
                      {rentNumber.isPending ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Renting...</>
                      ) : (
                        <><Check className="w-4 h-4 mr-2" /> Rent Number</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {searchNumbers.data && searchNumbers.data.numbers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No numbers found for area code {areaCode}. Try a different code.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


/**
 * Phone Numbers page - List of owned phone numbers
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Phone, Trash2, MessageSquare, PhoneCall, CreditCard, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMyNumbers, useReleaseNumber } from '@/hooks/useApi';
import { formatPhoneNumber, formatDate } from '@/utils/formatters';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { toast } from 'sonner';

const MAX_NUMBERS = 2; // Free tier limit

export default function PhoneNumbers() {
  const navigate = useNavigate();
  const { data, isLoading } = useMyNumbers();
  const releaseNumber = useReleaseNumber();
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<{ id: string; phoneNumber: string } | null>(null);

  const currentNumberCount = data?.phoneNumbers?.length || 0;
  const canRentMore = currentNumberCount < MAX_NUMBERS;

  const handleRentClick = () => {
    if (!canRentMore) {
      toast.error(`You've reached the free tier limit of ${MAX_NUMBERS} numbers.`, {
        description: 'Upgrade to rent more numbers',
        action: {
          label: 'Go to Billing',
          onClick: () => navigate('/billing'),
        },
        duration: 5000,
      });
      return;
    }
    navigate('/numbers/search');
  };

  const handleRelease = () => {
    if (selectedNumber) {
      releaseNumber.mutate(selectedNumber.id, {
        onSuccess: () => {
          setReleaseDialogOpen(false);
          setSelectedNumber(null);
        },
      });
    }
  };

  const openReleaseDialog = (id: string, phoneNumber: string) => {
    setSelectedNumber({ id, phoneNumber });
    setReleaseDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Phone Numbers</h1>
          <p className="text-gray-600 mt-1">Manage your virtual phone numbers</p>
          {canRentMore && (
            <p className="text-sm text-blue-600 mt-1">
              {currentNumberCount} of {MAX_NUMBERS} numbers (Free tier)
            </p>
          )}
        </div>
        <Button
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={handleRentClick}
          disabled={!canRentMore}
        >
          {!canRentMore ? (
            <>
              <AlertCircle className="w-4 h-4 mr-2" />
              Limit Reached
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Rent New Number
            </>
          )}
        </Button>
      </div>

      {/* Limit Reached Banner */}
      {!canRentMore && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-2 border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-amber-900 mb-1">
                    You've reached the free tier limit ({MAX_NUMBERS} numbers)
                  </p>
                  <p className="text-sm text-amber-700 mb-3">
                    Upgrade your plan to rent more phone numbers and unlock additional features.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => navigate('/billing')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Go to Billing
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Numbers List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data?.phoneNumbers && data.phoneNumbers.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {data.phoneNumbers.map((number, index) => (
            <motion.div
              key={number.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Phone className="w-10 h-10 p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white" />
                    <Badge variant={number.status === 'active' ? 'default' : 'secondary'}>
                      {number.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl mt-4">
                    {formatPhoneNumber(number.phoneNumber)}
                  </CardTitle>
                  <CardDescription>
                    {number.locality}, {number.region}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Rented: {formatDate(number.rentedAt)}</span>
                  </div>
                  
                  {/* Message/Call Stats */}
                  {(number.messageCount !== undefined || number.callCount !== undefined) && (
                    <div className="grid grid-cols-2 gap-2 py-2">
                      {number.messageCount !== undefined && (
                        <div className="flex items-center gap-2 text-sm">
                          <MessageSquare className="w-4 h-4 text-purple-600" />
                          <span className="font-medium">{number.messageCount}</span>
                          <span className="text-gray-500">msgs</span>
                        </div>
                      )}
                      {number.callCount !== undefined && (
                        <div className="flex items-center gap-2 text-sm">
                          <PhoneCall className="w-4 h-4 text-green-600" />
                          <span className="font-medium">{number.callCount}</span>
                          <span className="text-gray-500">calls</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {number.capabilities?.sms && (
                      <Badge variant="outline">SMS</Badge>
                    )}
                    {number.capabilities?.voice && (
                      <Badge variant="outline">Voice</Badge>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => openReleaseDialog(number.id, number.phoneNumber)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Release Number
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card className="border-0 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Phone className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No phone numbers yet</h3>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              Rent your first virtual phone number to start sending messages and making calls
            </p>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600"
              onClick={() => navigate('/numbers/search')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Search Available Numbers
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Release Number Dialog - Single instance outside the loop */}
      <Dialog open={releaseDialogOpen} onOpenChange={setReleaseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Release Phone Number?</DialogTitle>
            <DialogDescription>
              Are you sure you want to release {selectedNumber ? formatPhoneNumber(selectedNumber.phoneNumber) : 'this number'}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReleaseDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRelease}
              disabled={releaseNumber.isPending}
            >
              {releaseNumber.isPending ? 'Releasing...' : 'Release'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


/**
 * Phone Numbers page - List of owned phone numbers
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Phone, Trash2 } from 'lucide-react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

export default function PhoneNumbers() {
  const navigate = useNavigate();
  const { data, isLoading } = useMyNumbers();
  const releaseNumber = useReleaseNumber();
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);

  const handleRelease = () => {
    if (selectedNumber) {
      releaseNumber.mutate(selectedNumber, {
        onSuccess: () => {
          setReleaseDialogOpen(false);
          setSelectedNumber(null);
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Phone Numbers</h1>
          <p className="text-gray-600 mt-1">Manage your virtual phone numbers</p>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={() => navigate('/numbers/search')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Rent New Number
        </Button>
      </div>

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
                  <div className="flex gap-2">
                    {number.capabilities?.sms && (
                      <Badge variant="outline">SMS</Badge>
                    )}
                    {number.capabilities?.voice && (
                      <Badge variant="outline">Voice</Badge>
                    )}
                  </div>
                  <Dialog open={releaseDialogOpen} onOpenChange={setReleaseDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => setSelectedNumber(number.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Release Number
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Release Phone Number?</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to release {formatPhoneNumber(number.phoneNumber)}? This action cannot be undone.
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
    </div>
  );
}


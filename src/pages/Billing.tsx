/**
 * Billing page - Simple placeholder
 */

import { CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Billing() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Billing & Subscriptions</h1>
      <Card className="border-0 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <CreditCard className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Billing Management</h3>
          <p className="text-gray-600 text-center max-w-md">
            Manage your subscription, payment methods, and view usage
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


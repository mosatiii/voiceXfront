/**
 * Billing page - Coming soon message
 */

import { CreditCard, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Billing() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing & Subscriptions</h1>
        <p className="text-gray-600 mt-1">Manage your subscription and payment methods</p>
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-20">
          <div className="relative mb-6">
            <CreditCard className="w-20 h-20 text-blue-500" />
            <div className="absolute -top-2 -right-2">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                Coming Soon
              </Badge>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Billing is Coming Soon!</h3>
          
          <p className="text-gray-600 text-center max-w-lg mb-2">
            We're working hard to bring you premium billing features including:
          </p>
          
          <ul className="text-gray-600 text-center max-w-md mb-6 space-y-2">
            <li>• Multiple subscription tiers</li>
            <li>• Payment method management</li>
            <li>• Usage analytics and billing history</li>
            <li>• Upgrade to rent unlimited phone numbers</li>
          </ul>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 max-w-md w-full">
            <p className="text-center text-gray-700 font-medium mb-1">
              🎉 Enjoy the free version now!
            </p>
            <p className="text-center text-sm text-gray-600">
              You can rent up to <strong>2 phone numbers</strong> for free. 
              Stay tuned for premium features!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


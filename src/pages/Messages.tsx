/**
 * Messages page - Simple placeholder
 */

import { MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Messages() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Messages</h1>
      <Card className="border-0 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <MessageSquare className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Messaging Feature</h3>
          <p className="text-gray-600 text-center max-w-md">
            Send and receive SMS messages through your virtual phone numbers
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


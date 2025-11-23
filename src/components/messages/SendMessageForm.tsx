/**
 * Send Message Form Component
 * Form for sending SMS messages
 */

import { useState } from 'react';
import * as React from 'react';
import { Send, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSendMessage } from '@/hooks/useApi';
import type { PhoneNumber } from '@/types/models';

interface SendMessageFormProps {
  phoneNumbers: PhoneNumber[];
  onSuccess?: () => void;
}

export function SendMessageForm({ phoneNumbers, onSuccess }: SendMessageFormProps) {
  const [selectedNumberId, setSelectedNumberId] = useState<string>('');
  const [countryCode, setCountryCode] = useState('+1'); // Default to US
  const [phoneNumber, setPhoneNumber] = useState('');
  const [body, setBody] = useState('');

  const sendMessage = useSendMessage();
  
  // Auto-select first SMS-capable number
  React.useEffect(() => {
    if (!selectedNumberId && phoneNumbers.length > 0) {
      const firstSmsNumber = phoneNumbers.find(n => n.status === 'active' && n.capabilities?.sms !== false);
      if (firstSmsNumber) {
        setSelectedNumberId(firstSmsNumber.id);
      }
    }
  }, [phoneNumbers, selectedNumberId]);

  // Format phone number as user types
  const handlePhoneChange = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 10 digits for US/Canada
    const limited = digits.slice(0, 10);
    
    // Format as (XXX) XXX-XXXX
    let formatted = limited;
    if (limited.length > 6) {
      formatted = `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
    } else if (limited.length > 3) {
      formatted = `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
    } else if (limited.length > 0) {
      formatted = `(${limited}`;
    }
    
    setPhoneNumber(formatted);
  };

  // Get E.164 format for API
  const getE164Number = () => {
    const digits = phoneNumber.replace(/\D/g, '');
    return `${countryCode}${digits}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const digits = phoneNumber.replace(/\D/g, '');
    if (!selectedNumberId || !digits || !body) return;

    const e164Number = getE164Number();

    sendMessage.mutate(
      {
        phoneNumberId: selectedNumberId,
        to: e164Number, // Send in E.164 format
        body,
      },
      {
        onSuccess: () => {
          // Clear form
          setPhoneNumber('');
          setBody('');
          onSuccess?.();
        },
      }
    );
  };

  const charCount = body.length;
  const smsCount = Math.ceil(charCount / 160);
  const charsRemaining = smsCount * 160 - charCount;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* From Number Selector - Compact */}
          <div>
            <Label htmlFor="from">From (Your Number)</Label>
            
            {phoneNumbers.length === 0 ? (
              <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                No phone numbers available. Please rent a number first.
              </div>
            ) : phoneNumbers.length === 1 ? (
              // Single number - just show it
              <div className="mt-2 p-3 bg-blue-50 border-2 border-blue-600 rounded-lg">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{phoneNumbers[0].phoneNumber}</span>
                  <Badge variant="default" className="text-xs ml-auto">Selected</Badge>
                </div>
              </div>
            ) : (
              // Multiple numbers - compact buttons
              <div className="mt-2 grid grid-cols-2 gap-2">
                {phoneNumbers
                  .filter(n => n.status === 'active' && n.capabilities?.sms !== false)
                  .map((number) => {
                    const isSelected = selectedNumberId === number.id;
                    
                    return (
                      <button
                        key={number.id}
                        type="button"
                        onClick={() => setSelectedNumberId(number.id)}
                        className={`p-2.5 rounded-lg border-2 text-left transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />}
                          <span className="text-sm font-medium truncate">{number.phoneNumber}</span>
                        </div>
                      </button>
                    );
                  })}
              </div>
            )}
          </div>

          {/* To Number - With Country Code */}
          <div>
            <Label htmlFor="to">To (Recipient Number)</Label>
            <div className="flex gap-2">
              {/* Country Code Selector */}
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="+1">🇺🇸 +1 (US)</option>
                <option value="+1">🇨🇦 +1 (CA)</option>
                <option value="+44">🇬🇧 +44 (UK)</option>
                <option value="+91">🇮🇳 +91 (IN)</option>
                <option value="+86">🇨🇳 +86 (CN)</option>
                <option value="+81">🇯🇵 +81 (JP)</option>
                <option value="+49">🇩🇪 +49 (DE)</option>
                <option value="+33">🇫🇷 +33 (FR)</option>
                <option value="+61">🇦🇺 +61 (AU)</option>
                <option value="+55">🇧🇷 +55 (BR)</option>
                <option value="+52">🇲🇽 +52 (MX)</option>
                <option value="+34">🇪🇸 +34 (ES)</option>
                <option value="+39">🇮🇹 +39 (IT)</option>
                <option value="+7">🇷🇺 +7 (RU)</option>
                <option value="+82">🇰🇷 +82 (KR)</option>
                <option value="+31">🇳🇱 +31 (NL)</option>
                <option value="+46">🇸🇪 +46 (SE)</option>
                <option value="+47">🇳🇴 +47 (NO)</option>
                <option value="+45">🇩🇰 +45 (DK)</option>
                <option value="+41">🇨🇭 +41 (CH)</option>
              </select>
              
              {/* Phone Number Input */}
              <div className="flex-1">
                <Input
                  id="to"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Will be sent as: {getE164Number() || `${countryCode}...`}
                </p>
              </div>
            </div>
          </div>

          {/* Message Body */}
          <div>
            <Label htmlFor="body">Message</Label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type your message here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[120px] resize-y"
              maxLength={1600}
              required
            />
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">
                {smsCount} SMS segment{smsCount !== 1 ? 's' : ''} ({charCount}/1600)
              </span>
              <span className={charsRemaining < 20 ? 'text-orange-600' : 'text-gray-600'}>
                {charsRemaining} chars until next segment
              </span>
            </div>
          </div>

          {/* Send Button */}
          <Button
            type="submit"
            disabled={sendMessage.isPending || !selectedNumberId || !phoneNumber.replace(/\D/g, '') || !body}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
          >
            {sendMessage.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
    </div>
  );
}


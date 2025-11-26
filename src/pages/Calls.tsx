/**
 * Calls Page - Complete voice calling interface
 * Make calls, view history, handle incoming calls
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, History, Search, PhoneCall } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialPad } from '@/components/calls/DialPad';
import { CallInterface } from '@/components/calls/CallInterface';
import { IncomingCallModal } from '@/components/calls/IncomingCallModal';
import { useMyNumbers, useCalls } from '@/hooks/useApi';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useUIStore } from '@/store/uiStore';
import { formatPhoneNumber, formatRelativeTime } from '@/utils/formatters';

export default function Calls() {
  const [selectedNumberId, setSelectedNumberId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1'); // Default to US
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch user's phone numbers
  const { data: numbersData, isLoading: numbersLoading } = useMyNumbers();
  const phoneNumbers = numbersData?.phoneNumbers || [];

  // Auto-select first voice-capable number (using useEffect to avoid render issues)
  useEffect(() => {
    // Only auto-select if no number is selected AND we have numbers available
    if (!selectedNumberId && phoneNumbers.length > 0) {
      const firstVoiceNumber = phoneNumbers.find(
        (n) => n.status === 'active' && n.capabilities?.voice !== false
      );
      if (firstVoiceNumber) {
        console.log('Auto-selecting first voice number:', firstVoiceNumber.id);
        setSelectedNumberId(firstVoiceNumber.id);
      }
    }
  }, [selectedNumberId, phoneNumbers]);
  
  // Debug: Log when selectedNumberId changes
  useEffect(() => {
    console.log('Selected number ID changed to:', selectedNumberId);
  }, [selectedNumberId]);

  // Fetch call history
  const { data: callsData, isLoading: callsLoading } = useCalls(
    selectedNumberId ? { phoneNumberId: selectedNumberId, limit: 50 } : { limit: 50 },
    { enabled: !!selectedNumberId }
  );

  const calls = callsData?.calls || [];

  // WebRTC hook for making calls - pass the selected phone number ID
  const {
    callStatus,
    currentCall,
    isMuted,
    callDuration,
    makeCall,
    endCall,
    acceptCall,
    rejectCall,
    toggleMute,
  } = useWebRTC(selectedNumberId || undefined);

  // Incoming call state from UI store
  const incomingCall = useUIStore((state) => state.incomingCall);

  const selectedNumber = phoneNumbers.find((n) => n.id === selectedNumberId);

  // Format number with country code
  const getE164Number = () => {
    const digits = phoneNumber.replace(/\D/g, '');
    // If number already starts with +, use as is
    if (phoneNumber.startsWith('+')) {
      return phoneNumber.replace(/\D/g, '').substring(0, 15); // Max 15 digits for E.164
    }
    // Otherwise, prepend country code
    return `${countryCode}${digits}`;
  };

  const handleMakeCall = async () => {
    if (!selectedNumberId || !phoneNumber || !selectedNumber) return;

    try {
      const e164Number = getE164Number();
      // Pass the phoneNumberId (database ID), not the phone number string
      await makeCall(e164Number, selectedNumberId);
    } catch (error) {
      console.error('Failed to make call:', error);
    }
  };

  const handleAcceptIncoming = () => {
    // Accept the incoming call using Twilio SDK
    acceptCall();
  };

  const handleRejectIncoming = () => {
    // Reject the incoming call using Twilio SDK
    rejectCall();
  };

  // Filter call history
  const filteredCalls = calls.filter((call) => {
    const contact = call.direction === 'inbound' ? call.from : call.to;
    // Safety check: ensure contact exists before calling toLowerCase
    return contact ? contact.toLowerCase().includes(searchQuery.toLowerCase()) : false;
  });

  if (numbersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (phoneNumbers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Card className="max-w-md p-8 text-center">
          <PhoneCall className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Phone Numbers</h3>
          <p className="text-gray-600 mb-6">
            Rent a phone number to start making calls
          </p>
          <Button
            onClick={() => (window.location.href = '/numbers/search')}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Rent Number
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Calls</h1>
        <p className="text-gray-600 mt-1">Make and receive voice calls</p>
      </div>

      {/* Active Call Interface */}
      {callStatus !== 'idle' && currentCall && (
        <CallInterface
          phoneNumber={currentCall.parameters?.To || 'Unknown'}
          status={callStatus}
          duration={callDuration}
          isMuted={isMuted}
          onMute={toggleMute}
          onHangup={endCall}
        />
      )}

      {/* Incoming Call Modal */}
      {incomingCall && (
        <IncomingCallModal
          phoneNumber={incomingCall.from}
          onAccept={handleAcceptIncoming}
          onReject={handleRejectIncoming}
        />
      )}

      {/* Main Interface - Only show when not in active call */}
      {callStatus === 'idle' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Make Call */}
          <Card className="border-0 shadow-lg flex flex-col">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 py-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Phone className="w-4 h-4 text-blue-600" />
                Make a Call
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
                {/* Phone Number Selector */}
                <div>
                  <Label className="text-sm">From (Your Number)</Label>
                  <select
                    value={selectedNumberId || ''}
                    onChange={(e) => {
                      const newId = e.target.value || null;
                      console.log('📞 User selected phone number:', newId);
                      console.log('📞 Previous selection:', selectedNumberId);
                      setSelectedNumberId(newId);
                      // Force a small delay to ensure state updates
                      setTimeout(() => {
                        console.log('📞 State after update:', newId);
                      }, 0);
                    }}
                    className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    {phoneNumbers
                      .filter((n) => n.status === 'active' && n.capabilities?.voice !== false)
                      .map((number) => (
                        <option key={number.id} value={number.id}>
                          {formatPhoneNumber(number.phoneNumber)}
                        </option>
                      ))}
                  </select>
                  {selectedNumberId && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                      <span className="font-semibold text-blue-700">Active:</span>{' '}
                      <span className="text-blue-600">
                        {formatPhoneNumber(phoneNumbers.find(n => n.id === selectedNumberId)?.phoneNumber || '')}
                      </span>
                      {callsLoading && (
                        <span className="ml-2 text-gray-500">(Loading calls...)</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Country Code Selector */}
                <div>
                  <Label className="text-sm">Country</Label>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="+1">🇺🇸 +1 (US/CA)</option>
                    <option value="+44">🇬🇧 +44 (UK)</option>
                    <option value="+91">🇮🇳 +91 (IN)</option>
                    <option value="+86">🇨🇳 +86 (CN)</option>
                    <option value="+81">🇯🇵 +81 (JP)</option>
                    <option value="+49">🇩🇪 +49 (DE)</option>
                    <option value="+33">🇫🇷 +33 (FR)</option>
                    <option value="+61">🇦🇺 +61 (AU)</option>
                  </select>
                </div>

                {/* Dial Pad */}
                <div className="mt-2">
                  <DialPad
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    onCall={handleMakeCall}
                  />
                </div>
                
                <p className="text-xs text-gray-500 text-center">
                  Will call: {getE164Number() || `${countryCode}...`}
                </p>
            </CardContent>
          </Card>

          {/* Right Column - Call History */}
          <Card className="border-0 shadow-lg flex flex-col">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <History className="w-4 h-4 text-green-600" />
                  Call History
                </CardTitle>
                <Badge variant="secondary" className="text-xs">{calls.length}</Badge>
              </div>
              {/* Search */}
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-1 overflow-y-auto">
                {callsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 animate-pulse bg-gray-100 rounded-lg" />
                    ))}
                  </div>
                ) : filteredCalls.length > 0 ? (
                  <div className="space-y-3">
                    {filteredCalls.map((call) => (
                      <motion.div
                        key={call.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                      >
                        {/* Icon */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            call.direction === 'inbound'
                              ? 'bg-green-100'
                              : 'bg-blue-100'
                          }`}
                        >
                          <Phone
                            className={`w-5 h-5 ${
                              call.direction === 'inbound'
                                ? 'text-green-600'
                                : 'text-blue-600 transform rotate-180'
                            }`}
                          />
                        </div>

                        {/* Call Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {formatPhoneNumber(
                              call.direction === 'inbound' ? call.from : call.to
                            )}
                          </p>
                          <p className="text-sm text-gray-600">
                            {call.direction === 'inbound' ? 'Incoming' : 'Outgoing'} •{' '}
                            {call.duration
                              ? `${Math.floor(call.duration / 60)}:${String(
                                  call.duration % 60
                                ).padStart(2, '0')}`
                              : 'No duration'}
                          </p>
                        </div>

                        {/* Status and Time */}
                        <div className="text-right">
                          <Badge
                            variant={
                              call.status === 'completed' ? 'default' : 'secondary'
                            }
                            className="mb-1"
                          >
                            {call.status}
                          </Badge>
                          <p className="text-xs text-gray-500">
                            {formatRelativeTime(call.createdAt)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No call history yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Make your first call to get started
                    </p>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

/**
 * WebRTC voice calling hook using Twilio Client SDK
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Device, Call } from '@twilio/voice-sdk';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as callsApi from '@/api/calls';
import { useUIStore } from '@/store/uiStore';
import { getErrorMessage } from '@/api/client';

type CallStatus = 'idle' | 'connecting' | 'ringing' | 'active' | 'ended';

/**
 * Custom hook to manage Twilio WebRTC calls
 * @param phoneNumberId - The ID of the phone number to use for calls (required)
 */
export const useWebRTC = (phoneNumberId?: string) => {
  const [device, setDevice] = useState<Device | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [currentCall, setCurrentCall] = useState<Call | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isDeviceRegistered, setIsDeviceRegistered] = useState(false);
  const durationIntervalRef = useRef<number | null>(null);

  const queryClient = useQueryClient();
  const { setActiveCall, clearActiveCall, updateCallDuration, activeCall, setIncomingCall, clearIncomingCall } = useUIStore();

  // Fetch Twilio token - only fetch when we have a phoneNumberId
  const { data: tokenData } = useQuery({
    queryKey: ['twilio-token', phoneNumberId],
    queryFn: () => callsApi.getTwilioToken(phoneNumberId!),
    staleTime: 50 * 60 * 1000, // Token valid for ~1 hour
    retry: 2,
    enabled: !!phoneNumberId, // Only run query when phoneNumberId is available
  });

  // Initialize Twilio Device
  useEffect(() => {
    if (!tokenData?.token) {
      return;
    }

    try {
      const newDevice = new Device(tokenData.token, {
        logLevel: 'error',
        codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
      });

      // Device event listeners
      newDevice.on('registered', () => {
        console.log('✅ Twilio Device registered successfully');
        setIsDeviceRegistered(true);
      });

      newDevice.on('unregistered', () => {
        console.warn('⚠️ Twilio Device unregistered');
        setIsDeviceRegistered(false);
        // Try to re-register if we have a valid token
        if (tokenData?.token) {
          console.log('Attempting to re-register device...');
          setTimeout(() => {
            newDevice.register();
          }, 1000);
        }
      });

      newDevice.on('error', (error) => {
        console.error('❌ Twilio Device error:', error);
        setIsDeviceRegistered(false);
        
        // Handle specific error types
        if (error.code === 31005) {
          // Token expired - we'll need a new token
          console.error('Token expired, need to refresh');
          toast.error('Call device token expired. Refreshing...');
        } else {
          toast.error('Call device error: ' + error.message);
        }
      });

      newDevice.on('incoming', (call) => {
        console.log('📞 Incoming call received:', call);
        console.log('Device state:', newDevice.state);
        
        // Check if device is registered
        if (newDevice.state !== Device.State.Registered) {
          console.warn('⚠️ Device not registered when call arrived! Current state:', newDevice.state);
          console.warn('Attempting to register device...');
          newDevice.register();
        }
        
        setCurrentCall(call);
        setCallStatus('ringing');
        
        // Extract caller information from call parameters
        const from = call.parameters?.From || 'Unknown';
        const callSid = call.parameters?.CallSid || '';
        const incomingPhoneNumberId = call.parameters?.PhoneNumberId || phoneNumberId || '';
        
        // Show incoming call modal immediately
        setIncomingCall({
          callId: callSid,
          from: from,
          phoneNumberId: incomingPhoneNumberId,
        });
        
        setupCallHandlers(call);
        
        // Play notification sound (browser will handle this)
        // The modal appearing should be enough to alert the user
      });

      // Register device and track registration
      console.log('🔄 Registering Twilio Device...');
      newDevice.register();
      setDevice(newDevice);
      
      // Check registration status after a short delay
      setTimeout(() => {
        if (newDevice.state === Device.State.Registered) {
          setIsDeviceRegistered(true);
          console.log('✅ Device registration confirmed');
        } else {
          console.warn('⚠️ Device registration pending, state:', newDevice.state);
        }
      }, 2000);
    } catch (error) {
      console.error('Failed to initialize Twilio Device:', error);
      toast.error('Failed to initialize calling device');
    }

    return () => {
      if (device) {
        device.unregister();
        device.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenData]);

  // Setup call event handlers
  const setupCallHandlers = useCallback((call: Call) => {
    call.on('accept', () => {
      console.log('Call accepted');
      setCallStatus('active');
      clearIncomingCall(); // Clear incoming call modal
      setActiveCall({
        callId: call.parameters.CallSid || '',
        status: 'active',
        duration: 0,
        isMuted: false,
      });

      // Start duration timer
      startDurationTimer();
    });

    call.on('disconnect', () => {
      console.log('Call disconnected');
      setCallStatus('ended');
      stopDurationTimer();
      clearActiveCall();
      setCurrentCall(null);
      
      // Invalidate calls cache
      queryClient.invalidateQueries({ queryKey: ['calls'] });
    });

    call.on('cancel', () => {
      console.log('Call canceled');
      setCallStatus('ended');
      stopDurationTimer();
      clearActiveCall();
      setCurrentCall(null);
      
      // Invalidate calls cache to refresh call history
      queryClient.invalidateQueries({ queryKey: ['calls'] });
    });

    call.on('reject', () => {
      console.log('Call rejected');
      setCallStatus('ended');
      clearActiveCall();
      setCurrentCall(null);
      
      // Invalidate calls cache to refresh call history
      queryClient.invalidateQueries({ queryKey: ['calls'] });
    });

    call.on('error', (error) => {
      console.error('Call error:', error);
      toast.error('Call error: ' + error.message);
      setCallStatus('ended');
      stopDurationTimer();
      clearActiveCall();
      setCurrentCall(null);
      
      // Invalidate calls cache to refresh call history
      queryClient.invalidateQueries({ queryKey: ['calls'] });
    });
  }, [setActiveCall, clearActiveCall, clearIncomingCall, queryClient]);

  // Start call mutation
  const startCallMutation = useMutation({
    mutationFn: callsApi.startCall,
    onSuccess: () => {
      // Call initiated on backend
      queryClient.invalidateQueries({ queryKey: ['calls'] });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message || 'Failed to start call');
      setCallStatus('ended');
      clearActiveCall();
    },
  });

  // Make an outbound call
  const makeCall = useCallback(
    async (to: string, phoneNumberId: string) => {
      if (!device) {
        toast.error('Call device not ready');
        return;
      }

      try {
        setCallStatus('connecting');

        // Start call on backend
        await startCallMutation.mutateAsync({ phoneNumberId, to });

        // Connect via Twilio
        const call = await device.connect({
          params: {
            To: to,
            PhoneNumberId: phoneNumberId,
          },
        });

        setCurrentCall(call);
        setupCallHandlers(call);
      } catch (error) {
        console.error('Failed to make call:', error);
        toast.error('Failed to connect call');
        setCallStatus('ended');
      }
    },
    [device, startCallMutation, setupCallHandlers]
  );

  // End current call
  const endCall = useCallback(() => {
    if (currentCall) {
      currentCall.disconnect();
    }
    setCallStatus('ended');
    stopDurationTimer();
    clearActiveCall();
    
    // Invalidate calls cache to refresh call history immediately
    queryClient.invalidateQueries({ queryKey: ['calls'] });
  }, [currentCall, clearActiveCall, queryClient]);

  // Accept incoming call
  const acceptCall = useCallback(() => {
    if (currentCall && callStatus === 'ringing') {
      currentCall.accept();
      clearIncomingCall();
      // The 'accept' event handler will set status to 'active'
    }
  }, [currentCall, callStatus, clearIncomingCall]);

  // Reject incoming call
  const rejectCall = useCallback(() => {
    if (currentCall && callStatus === 'ringing') {
      currentCall.reject();
      clearIncomingCall();
      setCallStatus('ended');
      setCurrentCall(null);
    }
  }, [currentCall, callStatus, clearIncomingCall]);

  // Mute/unmute
  const toggleMute = useCallback(() => {
    if (currentCall) {
      const isMuted = currentCall.isMuted();
      currentCall.mute(!isMuted);
      
      // Update UI store
      useUIStore.getState().toggleMute();
      
      toast.info(isMuted ? 'Unmuted' : 'Muted');
    }
  }, [currentCall]);

  // Duration timer
  const startDurationTimer = () => {
    setCallDuration(0);
    durationIntervalRef.current = window.setInterval(() => {
      setCallDuration((prev) => {
        const newDuration = prev + 1;
        updateCallDuration(newDuration);
        return newDuration;
      });
    }, 1000);
  };

  const stopDurationTimer = () => {
    if (durationIntervalRef.current !== null) {
      window.clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    setCallDuration(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDurationTimer();
    };
  }, []);

  return {
    device,
    callStatus,
    currentCall,
    callDuration,
    makeCall,
    endCall,
    acceptCall,
    rejectCall,
    toggleMute,
    isReady: device !== null,
    isDeviceRegistered,
    isMuted: activeCall?.isMuted || false,
  };
};


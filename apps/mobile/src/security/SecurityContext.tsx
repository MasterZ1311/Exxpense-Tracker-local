import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const BIOMETRICS_KEY = 'fintrack_biometrics_enabled';

interface SecurityContextValue {
  isBiometricsSupported: boolean;
  isBiometricsEnabled: boolean;
  isUnlocked: boolean;
  biometricTypeName: string;
  toggleBiometrics: (enable: boolean) => Promise<boolean>;
  authenticateAsync: () => Promise<boolean>;
  lockApp: () => void;
}

const SecurityContext = createContext<SecurityContextValue | null>(null);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBiometricsSupported, setIsBiometricsSupported] = useState(false);
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [biometricTypeName, setBiometricTypeName] = useState('Biometrics');

  const checkSupport = useCallback(async () => {
    try {
      if (Platform.OS === 'web') {
        setIsBiometricsSupported(false);
        setIsUnlocked(true);
        return;
      }

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricsSupported(hasHardware && isEnrolled);

      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricTypeName('Face ID');
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricTypeName('Fingerprint / Touch ID');
      } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        setBiometricTypeName('Iris Recognition');
      }

      // Check if user previously enabled biometrics
      const saved = await SecureStore.getItemAsync(BIOMETRICS_KEY);
      const enabled = saved === 'true';
      setIsBiometricsEnabled(enabled);

      if (enabled && hasHardware && isEnrolled) {
        setIsUnlocked(false);
        // Prompt auth immediately on startup
        promptAuth();
      } else {
        setIsUnlocked(true);
      }
    } catch (e) {
      console.warn('Error checking biometrics:', e);
      setIsUnlocked(true);
    }
  }, []);

  const promptAuth = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'web') {
        setIsUnlocked(true);
        return true;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock FinTrack Pro',
        fallbackLabel: 'Enter Device Passcode',
        disableDeviceFallback: false,
        cancelLabel: 'Cancel',
      });

      if (result.success) {
        setIsUnlocked(true);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Biometric authentication failed:', e);
      return false;
    }
  };

  useEffect(() => {
    checkSupport();
  }, [checkSupport]);

  // Lock when app goes to background if biometrics is enabled
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' && isBiometricsEnabled) {
        setIsUnlocked(false);
      } else if (nextAppState === 'active' && isBiometricsEnabled && !isUnlocked) {
        promptAuth();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [isBiometricsEnabled, isUnlocked]);

  const toggleBiometrics = async (enable: boolean): Promise<boolean> => {
    if (enable) {
      const authSuccess = await promptAuth();
      if (!authSuccess) return false;
      await SecureStore.setItemAsync(BIOMETRICS_KEY, 'true');
      setIsBiometricsEnabled(true);
      setIsUnlocked(true);
      return true;
    } else {
      await SecureStore.setItemAsync(BIOMETRICS_KEY, 'false');
      setIsBiometricsEnabled(false);
      setIsUnlocked(true);
      return true;
    }
  };

  const lockApp = () => {
    if (isBiometricsEnabled) {
      setIsUnlocked(false);
    }
  };

  return (
    <SecurityContext.Provider
      value={{
        isBiometricsSupported,
        isBiometricsEnabled,
        isUnlocked,
        biometricTypeName,
        toggleBiometrics,
        authenticateAsync: promptAuth,
        lockApp,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = (): SecurityContextValue => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

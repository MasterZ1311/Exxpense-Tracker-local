import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSecurity } from './SecurityContext';
import { useTheme } from '../theme/ThemeContext';
import { Text, LedgerLabel, EditorialHeadline } from '../components/Typography';
import { Button } from '../components/Button';
import { Lock } from 'lucide-react-native';

export const BiometricLockGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isUnlocked, authenticateAsync, biometricTypeName } = useSecurity();
  const { colors, radii } = useTheme();

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.paper }]}>
      <View style={styles.centerContent}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logoEmblem}
          resizeMode="contain"
        />

        <LedgerLabel style={styles.label}>OIKOS LEDGER LOCKED</LedgerLabel>
        <EditorialHeadline size={28} style={styles.headline}>
          Oikos
        </EditorialHeadline>
        
        <Text variant="secondary" size={14} style={styles.subtitle}>
          Authenticate with {biometricTypeName} to unlock your personal ledger.
        </Text>

        <Button
          title={`UNLOCK WITH ${biometricTypeName.toUpperCase()}`}
          size="lg"
          variant="primary"
          onPress={() => authenticateAsync()}
          style={styles.unlockBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  centerContent: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  logoEmblem: {
    width: 88,
    height: 80,
    marginBottom: 20,
  },
  lockIconBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
  },
  headline: {
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  unlockBtn: {
    width: '100%',
  },
});

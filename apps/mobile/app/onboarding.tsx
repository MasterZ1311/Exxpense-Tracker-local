import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { useFinance } from '../src/state/FinanceContext';
import { OnboardingWizard } from '../src/features/onboarding/OnboardingWizard';
import { Profile, Account } from '@fintrack/domain';

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const { createProfile } = useFinance();
  const router = useRouter();

  const handleComplete = async (profile: Profile, initialAccount: Account) => {
    await createProfile(profile, initialAccount);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.paper }]}>
      <OnboardingWizard onComplete={handleComplete} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

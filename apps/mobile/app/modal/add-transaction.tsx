import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { useFinance } from '../../src/state/FinanceContext';
import { AddTransactionForm } from '../../src/features/transactions/AddTransactionForm';

export default function AddTransactionModalScreen() {
  const { colors } = useTheme();
  const { accounts, categories, profile, addTransaction } = useFinance();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.paper }]}>
      <AddTransactionForm
        accounts={accounts}
        categories={categories}
        currency={profile?.currency || 'INR'}
        profileId={profile?.id || 'default'}
        onSave={async (tx) => {
          await addTransaction(tx);
          router.back();
        }}
        onCancel={() => router.back()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

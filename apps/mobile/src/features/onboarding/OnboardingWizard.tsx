import React, { useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Text, LedgerLabel, EditorialHeadline } from '../../components/Typography';
import { Button } from '../../components/Button';
import { LedgerLine } from '../../components/LedgerLine';
import { Profile, Account, getCurrencySymbol } from '@fintrack/domain';

interface OnboardingWizardProps {
  onComplete: (profile: Profile, initialAccount: Account) => Promise<void>;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const { colors, typography, radii, spacing } = useTheme();

  const [step, setStep] = useState<'manifesto' | 'profile'>('manifesto');
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [accountName, setAccountName] = useState('Primary Checking');
  const [initialBalanceStr, setInitialBalanceStr] = useState('100000');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFinish = async () => {
    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    const initialBalance = parseFloat(initialBalanceStr) || 0;
    const now = new Date().toISOString();
    const profileId = `profile_${Date.now()}`;
    const accountId = `account_${Date.now()}`;

    const profile: Profile = {
      id: profileId,
      name: name.trim(),
      currency,
      isOnboarded: true,
      createdAt: now,
      updatedAt: now,
    };

    const initialAccount: Account = {
      id: accountId,
      profileId,
      name: accountName.trim() || 'Primary Checking',
      type: 'checking',
      balance: initialBalance,
      currency,
      isDefault: true,
      createdAt: now,
      updatedAt: now,
    };

    try {
      setLoading(true);
      setErrorMessage(null);
      await onComplete(profile, initialAccount);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to complete setup.');
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      {step === 'manifesto' ? (
        <View style={styles.manifestoContainer}>
          <View style={styles.manifestoHeader}>
            <LedgerLabel style={styles.brandSubtitle}>FINTRACK PRO</LedgerLabel>
            <EditorialHeadline size={36} style={styles.manifestoHeadline}>
              YOUR MONEY.{'\n'}YOUR DEVICE.{'\n'}YOUR RULES.
            </EditorialHeadline>
          </View>

          <LedgerLine style={styles.manifestoDivider} />

          <View style={styles.manifestoBody}>
            <Text variant="secondary" size={16} style={styles.philosophyText}>
              No account required.{'\n'}
              No financial data uploaded.{'\n'}
              A zero-backend personal financial instrument.
            </Text>
          </View>

          <Button
            title="GET STARTED →"
            size="lg"
            onPress={() => setStep('profile')}
            style={styles.manifestoButton}
          />
        </View>
      ) : (
        <View style={styles.profileContainer}>
          <LedgerLabel style={styles.setupLabel}>INITIAL SETUP</LedgerLabel>
          <EditorialHeadline size={28} style={styles.profileTitle}>
            Create your ledger
          </EditorialHeadline>

          {/* Name Field */}
          <View style={styles.fieldGroup}>
            <LedgerLabel style={styles.fieldLabel}>YOUR NAME OR ALIAS</LedgerLabel>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. MasterZ"
              placeholderTextColor={colors.inkSubtle}
              autoFocus
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surfaceInput,
                  color: colors.ink,
                  fontFamily: typography.fonts.sans,
                  borderRadius: radii.sm,
                },
              ]}
            />
          </View>

          {/* Currency Selection */}
          <View style={styles.fieldGroup}>
            <LedgerLabel style={styles.fieldLabel}>PRIMARY CURRENCY</LedgerLabel>
            <View style={styles.currencyRow}>
              {['INR', 'USD', 'EUR', 'GBP'].map((curr) => {
                const isSelected = currency === curr;
                return (
                  <Button
                    key={curr}
                    title={`${getCurrencySymbol(curr).trim()} ${curr}`}
                    size="sm"
                    variant={isSelected ? 'primary' : 'outline'}
                    onPress={() => setCurrency(curr)}
                    style={styles.currencyBtn}
                  />
                );
              })}
            </View>
          </View>

          {/* Primary Account Name & Initial Balance */}
          <View style={styles.fieldGroup}>
            <LedgerLabel style={styles.fieldLabel}>DEFAULT ACCOUNT NAME</LedgerLabel>
            <TextInput
              value={accountName}
              onChangeText={setAccountName}
              placeholder="e.g. HDFC Bank, Primary Checking, Cash"
              placeholderTextColor={colors.inkSubtle}
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surfaceInput,
                  color: colors.ink,
                  fontFamily: typography.fonts.sans,
                  borderRadius: radii.sm,
                },
              ]}
            />
          </View>

          <View style={styles.fieldGroup}>
            <LedgerLabel style={styles.fieldLabel}>STARTING BALANCE ({getCurrencySymbol(currency).trim()})</LedgerLabel>
            <TextInput
              value={initialBalanceStr}
              onChangeText={(val) => setInitialBalanceStr(val.replace(/[^0-9.]/g, ''))}
              placeholder="0"
              placeholderTextColor={colors.inkSubtle}
              keyboardType="decimal-pad"
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surfaceInput,
                  color: colors.ink,
                  fontFamily: typography.fonts.display,
                  fontSize: 20,
                  borderRadius: radii.sm,
                },
              ]}
            />
          </View>

          {errorMessage && (
            <Text variant="caption" color={colors.terracotta} style={styles.errorText}>
              {errorMessage}
            </Text>
          )}

          <Button
            title="OPEN FINANCIAL INSTRUMENT →"
            size="lg"
            loading={loading}
            onPress={handleFinish}
            style={styles.finishButton}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 48,
    justifyContent: 'center',
  },
  manifestoContainer: {
    paddingVertical: 20,
  },
  manifestoHeader: {
    marginBottom: 28,
  },
  brandSubtitle: {
    marginBottom: 12,
  },
  manifestoHeadline: {
    lineHeight: 44,
  },
  manifestoDivider: {
    marginVertical: 20,
  },
  manifestoBody: {
    marginBottom: 36,
  },
  philosophyText: {
    lineHeight: 28,
  },
  manifestoButton: {
    marginTop: 12,
  },
  profileContainer: {
    paddingVertical: 12,
  },
  setupLabel: {
    marginBottom: 6,
  },
  profileTitle: {
    marginBottom: 24,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    marginBottom: 8,
  },
  textInput: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  currencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currencyBtn: {
    flex: 1,
    marginHorizontal: 3,
  },
  errorText: {
    marginTop: 8,
    marginBottom: 12,
  },
  finishButton: {
    marginTop: 16,
  },
});

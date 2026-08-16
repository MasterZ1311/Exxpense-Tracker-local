import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { DisplayNumber, EditorialHeadline, Text, LedgerLabel } from '../../components/Typography';
import { formatCurrency, formatEditorialHeaderDate, getEditorialGreeting } from '@fintrack/domain';

interface HeroBalanceProps {
  balance: number;
  currency?: string;
  userName?: string;
  growthPercentage?: number;
}

export const HeroBalance: React.FC<HeroBalanceProps> = ({
  balance,
  currency = 'INR',
  userName,
  growthPercentage = 8.4,
}) => {
  const { colors, spacing } = useTheme();
  const todayFormatted = formatEditorialHeaderDate();
  const greeting = getEditorialGreeting(userName);
  const isPositiveGrowth = growthPercentage >= 0;

  return (
    <View style={styles.container}>
      {/* Date Header */}
      <LedgerLabel style={styles.dateLabel}>{todayFormatted}</LedgerLabel>

      {/* Greeting */}
      <Text variant="secondary" size={16} style={styles.greetingText}>
        {greeting}
      </Text>

      {/* Hero Display Balance */}
      <View style={styles.balanceContainer}>
        <DisplayNumber size={44} style={styles.balanceNumber}>
          {formatCurrency(balance, currency)}
        </DisplayNumber>
        <LedgerLabel style={styles.balanceSubtext}>TOTAL BALANCE</LedgerLabel>
      </View>

      {/* Growth Trend */}
      <View style={styles.growthRow}>
        <Text
          variant="semibold"
          size={13}
          color={isPositiveGrowth ? colors.moss : colors.terracotta}
        >
          {isPositiveGrowth ? '↑' : '↓'} {Math.abs(growthPercentage)}%
        </Text>
        <Text variant="secondary" size={13} style={styles.growthSubtext}>
          {' '}from last month
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  dateLabel: {
    marginBottom: 6,
  },
  greetingText: {
    marginBottom: 16,
  },
  balanceContainer: {
    marginBottom: 8,
  },
  balanceNumber: {
    lineHeight: 52,
  },
  balanceSubtext: {
    marginTop: 4,
  },
  growthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  growthSubtext: {
    marginLeft: 2,
  },
});

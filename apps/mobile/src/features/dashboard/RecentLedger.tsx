import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Text, LedgerLabel, DisplayNumber } from '../../components/Typography';
import { LedgerLine } from '../../components/LedgerLine';
import { Button } from '../../components/Button';
import { Transaction, formatCurrency, formatLedgerDate, formatTransactionTime } from '@fintrack/domain';

interface RecentLedgerProps {
  transactions: Transaction[];
  accountMap?: Record<string, string>; // accountId -> name
  currency?: string;
  onAddTransaction: () => void;
  onSelectTransaction?: (tx: Transaction) => void;
  onViewAll?: () => void;
}

export const RecentLedger: React.FC<RecentLedgerProps> = ({
  transactions,
  accountMap = {},
  currency = 'INR',
  onAddTransaction,
  onSelectTransaction,
  onViewAll,
}) => {
  const { colors, spacing } = useTheme();

  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <LedgerLabel style={styles.emptyTitle}>YOUR LEDGER IS QUIET.</LedgerLabel>
        <Text variant="secondary" size={14} style={styles.emptySubtitle}>
          Add your first transaction to start seeing your financial picture.
        </Text>
        <Button
          title="ADD TRANSACTION"
          size="sm"
          onPress={onAddTransaction}
          style={styles.emptyButton}
        />
      </View>
    );
  }

  // Group transactions by ledger date string
  const grouped: Record<string, Transaction[]> = {};
  for (const tx of transactions) {
    const dateKey = formatLedgerDate(tx.date);
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(tx);
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <LedgerLabel>RECENT TRANSACTIONS</LedgerLabel>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text variant="caption" color={colors.inkMuted}>
              VIEW ALL →
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {Object.entries(grouped).map(([dateKey, items], groupIndex) => (
        <View key={dateKey} style={styles.groupBlock}>
          <LedgerLabel style={styles.dateHeader}>{dateKey}</LedgerLabel>
          <LedgerLine style={styles.dateDivider} />

          {items.map((tx) => {
            const isIncome = tx.type === 'income';
            const isTransfer = tx.type === 'transfer';
            const amountColor = isIncome
              ? colors.moss
              : isTransfer
              ? colors.plum
              : colors.terracotta;

            const signPrefix = isIncome ? '+' : isTransfer ? '' : '-';
            const accountName = accountMap[tx.accountId] || 'Primary';
            const timeStr = formatTransactionTime(tx.date);

            return (
              <TouchableOpacity
                key={tx.id}
                onPress={() => onSelectTransaction && onSelectTransaction(tx)}
                activeOpacity={0.7}
                style={styles.transactionRow}
              >
                <View style={styles.leftCol}>
                  <Text variant="medium" size={15} color={colors.ink}>
                    {tx.description}
                  </Text>
                  <Text variant="caption" color={colors.inkMuted} style={styles.metadataText}>
                    {tx.category} · {accountName}
                  </Text>
                </View>

                <View style={styles.rightCol}>
                  <Text
                    variant="semibold"
                    size={15}
                    color={amountColor}
                    style={styles.amountText}
                  >
                    {signPrefix}
                    {formatCurrency(tx.amount, currency)}
                  </Text>
                  <Text variant="caption" color={colors.inkSubtle}>
                    {timeStr}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupBlock: {
    marginBottom: 20,
  },
  dateHeader: {
    marginBottom: 6,
  },
  dateDivider: {
    marginBottom: 10,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  leftCol: {
    flex: 1,
    paddingRight: 12,
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  metadataText: {
    marginTop: 3,
  },
  amountText: {
    fontVariant: ['tabular-nums'],
    marginBottom: 2,
  },
  emptyContainer: {
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'flex-start',
  },
  emptyTitle: {
    marginBottom: 8,
  },
  emptySubtitle: {
    lineHeight: 20,
    marginBottom: 18,
  },
  emptyButton: {
    alignSelf: 'flex-start',
  },
});

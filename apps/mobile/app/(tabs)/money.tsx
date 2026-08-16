import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeContext';
import { useFinance } from '../../src/state/FinanceContext';
import { Text, LedgerLabel, EditorialHeadline } from '../../src/components/Typography';
import { LedgerLine } from '../../src/components/LedgerLine';
import { SegmentedControl } from '../../src/components/SegmentedControl';
import { RecentLedger } from '../../src/features/dashboard/RecentLedger';
import { TransactionFilterBar, TypeFilterOption } from '../../src/features/transactions/TransactionFilterBar';
import { EditTransactionModal } from '../../src/features/transactions/EditTransactionModal';
import { formatCurrency, Transaction } from '@fintrack/domain';

export default function MoneyScreen() {
  const { colors, radii } = useTheme();
  const {
    accounts,
    transactions,
    categories,
    accountMap,
    profile,
    updateTransaction,
    deleteTransaction,
  } = useFinance();

  const [activeSubTab, setActiveSubTab] = useState<'ledger' | 'accounts'>('ledger');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<TypeFilterOption>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Filtered transactions computation
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type match
      if (selectedType !== 'all' && tx.type !== selectedType) return false;

      // Category match
      if (selectedCategory && tx.category !== selectedCategory) return false;

      // Search query match
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const descMatch = tx.description.toLowerCase().includes(q);
        const catMatch = tx.category.toLowerCase().includes(q);
        const notesMatch = tx.notes ? tx.notes.toLowerCase().includes(q) : false;
        const merchantMatch = tx.merchant ? tx.merchant.toLowerCase().includes(q) : false;
        if (!descMatch && !catMatch && !notesMatch && !merchantMatch) return false;
      }

      return true;
    });
  }, [transactions, selectedType, selectedCategory, searchQuery]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.paper }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <LedgerLabel style={styles.headerLabel}>MONEY & LEDGER</LedgerLabel>
          <EditorialHeadline size={28}>Accounts & Cash Flow</EditorialHeadline>
        </View>

        {/* SubTab Selector */}
        <SegmentedControl<'ledger' | 'accounts'>
          options={[
            { value: 'ledger', label: 'FULL LEDGER' },
            { value: 'accounts', label: 'ACCOUNTS' },
          ]}
          value={activeSubTab}
          onChange={setActiveSubTab}
          style={styles.subTab}
        />

        {activeSubTab === 'ledger' ? (
          <View>
            {/* Search & Filter Bar */}
            <TransactionFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
            />

            {/* Filter Results Summary */}
            {(searchQuery.length > 0 || selectedType !== 'all' || selectedCategory) && (
              <View style={styles.filterSummaryRow}>
                <Text variant="caption" color={colors.inkMuted}>
                  SHOWING {filteredTransactions.length} OF {transactions.length} ENTRIES
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedType('all');
                    setSelectedCategory(null);
                  }}
                >
                  <Text variant="caption" color={colors.terracotta}>
                    RESET FILTERS
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <RecentLedger
              transactions={filteredTransactions}
              accountMap={accountMap}
              currency={profile?.currency || 'INR'}
              onAddTransaction={() => {}}
              onSelectTransaction={(tx) => setSelectedTx(tx)}
            />
          </View>
        ) : (
          <View style={styles.accountsSection}>
            {accounts.map((account) => (
              <View key={account.id} style={styles.accountRow}>
                <View style={styles.accountInfo}>
                  <Text variant="semibold" size={16} color={colors.ink}>
                    {account.name}
                  </Text>
                  <Text variant="caption" color={colors.inkMuted} style={styles.accountType}>
                    {account.type.toUpperCase()} {account.institution ? `· ${account.institution}` : ''}
                  </Text>
                </View>
                <View style={styles.accountBalance}>
                  <Text variant="semibold" size={17} color={colors.ink}>
                    {formatCurrency(account.balance, account.currency)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Edit / Delete Transaction Modal */}
      <Modal
        visible={!!selectedTx}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedTx(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setSelectedTx(null)}
          />
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.surfacePrimary,
                borderTopLeftRadius: radii.sheet,
                borderTopRightRadius: radii.sheet,
                borderColor: colors.border,
                borderTopWidth: 1,
              },
            ]}
          >
            <View style={styles.dragHandleContainer}>
              <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />
            </View>
            <EditTransactionModal
              transaction={selectedTx}
              accounts={accounts}
              categories={categories}
              currency={profile?.currency || 'INR'}
              onUpdate={async (updatedTx) => {
                await updateTransaction(updatedTx);
                setSelectedTx(null);
              }}
              onDelete={async (id) => {
                await deleteTransaction(id);
                setSelectedTx(null);
              }}
              onCancel={() => setSelectedTx(null)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerLabel: {
    marginBottom: 6,
  },
  subTab: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  filterSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  accountsSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth || 1,
    borderBottomColor: '#DDD8CB',
  },
  accountInfo: {
    flex: 1,
  },
  accountType: {
    marginTop: 4,
  },
  accountBalance: {
    alignItems: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(16, 19, 16, 0.4)',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    maxHeight: '88%',
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
});

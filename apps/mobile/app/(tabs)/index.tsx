import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeContext';
import { useFinance } from '../../src/state/FinanceContext';
import { HeroBalance } from '../../src/features/dashboard/HeroBalance';
import { MoneyFlowRibbon } from '../../src/features/dashboard/MoneyFlowRibbon';
import { FinancialPulse } from '../../src/features/dashboard/FinancialPulse';
import { RecentLedger } from '../../src/features/dashboard/RecentLedger';
import { LedgerLine } from '../../src/components/LedgerLine';
import { AddTransactionForm } from '../../src/features/transactions/AddTransactionForm';
import { EditTransactionModal } from '../../src/features/transactions/EditTransactionModal';
import { Button } from '../../src/components/Button';
import { Text } from '../../src/components/Typography';
import { Transaction } from '@fintrack/domain';

export default function HomeScreen() {
  const { colors, radii } = useTheme();
  const {
    profile,
    accounts,
    transactions,
    categories,
    totalBalance,
    moneyFlow,
    financialPulse,
    growthPercentage,
    accountMap,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useFinance();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.paper }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Editorial Hero Balance Section */}
        <HeroBalance
          balance={totalBalance}
          currency={profile?.currency || 'INR'}
          userName={profile?.name}
          growthPercentage={growthPercentage}
        />

        <LedgerLine />

        {/* Signature Money Flow Ribbon */}
        <MoneyFlowRibbon
          summary={moneyFlow}
          currency={profile?.currency || 'INR'}
        />

        <LedgerLine />

        {/* Financial Pulse */}
        <FinancialPulse pulse={financialPulse} />

        <LedgerLine />

        {/* Ledger-style Recent Transactions */}
        <RecentLedger
          transactions={transactions.slice(0, 10)}
          accountMap={accountMap}
          currency={profile?.currency || 'INR'}
          onAddTransaction={() => setIsAddModalOpen(true)}
          onSelectTransaction={(tx) => setSelectedTx(tx)}
        />
      </ScrollView>

      {/* Floating Tactical Add Button */}
      <View style={styles.floatingButtonContainer}>
        <Button
          title="+ ADD TRANSACTION"
          size="md"
          variant="primary"
          onPress={() => setIsAddModalOpen(true)}
          style={[styles.floatingButton, { backgroundColor: colors.chartreuse }]}
        />
      </View>

      {/* Bottom Sheet Modal for Edit Transaction */}
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

      {/* Bottom Sheet Modal for Add Transaction */}
      <Modal
        visible={isAddModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setIsAddModalOpen(false)}
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
            <AddTransactionForm
              accounts={accounts}
              categories={categories}
              currency={profile?.currency || 'INR'}
              profileId={profile?.id || 'default'}
              onSave={async (tx) => {
                await addTransaction(tx);
                setIsAddModalOpen(false);
              }}
              onCancel={() => setIsAddModalOpen(false)}
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
    paddingBottom: 90,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
  floatingButton: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
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

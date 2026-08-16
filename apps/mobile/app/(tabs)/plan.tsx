import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeContext';
import { useFinance } from '../../src/state/FinanceContext';
import { DisplayNumber, Text, LedgerLabel, EditorialHeadline } from '../../src/components/Typography';
import { LedgerLine } from '../../src/components/LedgerLine';
import { SegmentedControl } from '../../src/components/SegmentedControl';
import { Button } from '../../src/components/Button';
import { formatCurrency, calculateGoalProgress, calculateDebtPayoff } from '@fintrack/domain';

export default function PlanScreen() {
  const { colors, radii, typography, spacing } = useTheme();
  const {
    profile,
    budgets,
    goals,
    debts,
    budgetStatuses,
    categories,
    addBudget,
    addGoal,
    addDebt,
    updateGoalProgress,
  } = useFinance();

  const [activeTab, setActiveTab] = useState<'budgets' | 'goals' | 'debt'>('budgets');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for creating new items
  const [budgetName, setBudgetName] = useState('Food & Dining');
  const [budgetLimit, setBudgetLimit] = useState('10000');

  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('0');
  const [goalDate, setGoalDate] = useState('2026-12-31');

  const [debtName, setDebtName] = useState('');
  const [debtPrincipal, setDebtPrincipal] = useState('');
  const [debtRemaining, setDebtRemaining] = useState('');
  const [debtEmi, setDebtEmi] = useState('');
  const [debtRate, setDebtRate] = useState('10.5');

  const currency = profile?.currency || 'INR';

  const handleCreate = async () => {
    const now = new Date().toISOString();
    const profileId = profile?.id || 'default';

    if (activeTab === 'budgets') {
      const limit = parseFloat(budgetLimit) || 10000;
      await addBudget({
        profileId,
        category: budgetName,
        limitAmount: limit,
        period: 'monthly',
        startDate: now,
        alertThreshold: 0.8,
      });
    } else if (activeTab === 'goals') {
      if (!goalName.trim()) return;
      await addGoal({
        profileId,
        name: goalName.trim(),
        targetAmount: parseFloat(goalTarget) || 50000,
        currentAmount: parseFloat(goalCurrent) || 0,
        currency,
        targetDate: goalDate,
        category: 'Savings',
      });
      setGoalName('');
    } else if (activeTab === 'debt') {
      if (!debtName.trim()) return;
      await addDebt({
        profileId,
        name: debtName.trim(),
        principalAmount: parseFloat(debtPrincipal) || 200000,
        remainingAmount: parseFloat(debtRemaining) || parseFloat(debtPrincipal) || 150000,
        interestRate: parseFloat(debtRate) || 10.5,
        minimumEmi: parseFloat(debtEmi) || 5000,
        currency,
        startDate: '2024-01-01',
        targetPayoffDate: '2028-12-31',
      });
      setDebtName('');
    }
    setIsAddModalOpen(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.paper }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <LedgerLabel style={styles.headerLabel}>FINANCIAL ARCHITECTURE</LedgerLabel>
          <EditorialHeadline size={28}>Plan & Targets</EditorialHeadline>
        </View>

        {/* Segmented Switcher */}
        <SegmentedControl<'budgets' | 'goals' | 'debt'>
          options={[
            { value: 'budgets', label: 'BUDGETS' },
            { value: 'goals', label: 'GOALS' },
            { value: 'debt', label: 'DEBT' },
          ]}
          value={activeTab}
          onChange={setActiveTab}
          style={styles.segmentedTab}
        />

        {/* 1. Budgets View */}
        {activeTab === 'budgets' && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <LedgerLabel>ACTIVE BUDGET TRACKS</LedgerLabel>
              <TouchableOpacity onPress={() => setIsAddModalOpen(true)}>
                <Text variant="caption" color={colors.inkMuted}>
                  + NEW TRACK
                </Text>
              </TouchableOpacity>
            </View>

            {budgetStatuses.length === 0 ? (
              <Text variant="secondary" size={14} style={styles.emptyText}>
                No active budget tracks configured.
              </Text>
            ) : (
              budgetStatuses.map((track) => (
                <View key={track.budgetId} style={styles.trackCard}>
                  <View style={styles.trackTopRow}>
                    <Text variant="semibold" size={15} color={colors.ink}>
                      {track.category}
                    </Text>
                    <Text variant="caption" color={track.isOverBudget ? colors.terracotta : colors.inkMuted}>
                      {formatCurrency(track.spentAmount, currency)} / {formatCurrency(track.limitAmount, currency)}
                    </Text>
                  </View>

                  {/* Visual Track */}
                  <View style={[styles.trackBg, { backgroundColor: colors.bone, borderRadius: radii.sm }]}>
                    <View
                      style={[
                        styles.trackFill,
                        {
                          width: `${Math.min(100, track.percentage)}%`,
                          backgroundColor: track.isOverBudget ? colors.terracotta : colors.moss,
                          borderRadius: radii.sm,
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.trackBottomRow}>
                    <Text variant="caption" color={track.isOverBudget ? colors.terracotta : colors.inkSubtle}>
                      {track.isOverBudget
                        ? `Exceeded by ${formatCurrency(track.spentAmount - track.limitAmount, currency)}`
                        : `${formatCurrency(track.remainingAmount, currency)} left (${100 - track.percentage}%)`}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* 2. Goals View */}
        {activeTab === 'goals' && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <LedgerLabel>PERSONAL JOURNEYS</LedgerLabel>
              <TouchableOpacity onPress={() => setIsAddModalOpen(true)}>
                <Text variant="caption" color={colors.inkMuted}>
                  + NEW GOAL
                </Text>
              </TouchableOpacity>
            </View>

            {goals.length === 0 ? (
              <Text variant="secondary" size={14} style={styles.emptyText}>
                No financial goals created yet.
              </Text>
            ) : (
              goals.map((goal) => {
                const progress = calculateGoalProgress(goal);
                return (
                  <View key={goal.id} style={styles.goalCard}>
                    <View style={styles.goalHeaderRow}>
                      <Text variant="bold" size={17} color={colors.ink}>
                        {goal.name.toUpperCase()}
                      </Text>
                      <Text variant="semibold" size={15} color={colors.moss}>
                        {progress.percentage}%
                      </Text>
                    </View>

                    <Text variant="secondary" size={14} style={styles.goalAmounts}>
                      {formatCurrency(goal.currentAmount, currency)} of {formatCurrency(goal.targetAmount, currency)}
                    </Text>

                    {/* Progress Track */}
                    <View style={[styles.trackBg, { backgroundColor: colors.bone, borderRadius: radii.sm }]}>
                      <View
                        style={[
                          styles.trackFill,
                          {
                            width: `${progress.percentage}%`,
                            backgroundColor: colors.moss,
                            borderRadius: radii.sm,
                          },
                        ]}
                      />
                    </View>

                    <View style={styles.goalFooter}>
                      <Text variant="caption" color={colors.inkSubtle}>
                        Target: {goal.targetDate} ({progress.monthsRemaining} mo remaining)
                      </Text>
                      <Text variant="caption" color={colors.inkMuted}>
                        Need {formatCurrency(progress.requiredMonthlySavings, currency)}/mo
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* 3. Debt Payoff View */}
        {activeTab === 'debt' && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <LedgerLabel>PAYOFF TIMELINES</LedgerLabel>
              <TouchableOpacity onPress={() => setIsAddModalOpen(true)}>
                <Text variant="caption" color={colors.inkMuted}>
                  + ADD DEBT
                </Text>
              </TouchableOpacity>
            </View>

            {debts.length === 0 ? (
              <Text variant="secondary" size={14} style={styles.emptyText}>
                No liabilities or debt accounts recorded. You are debt-free!
              </Text>
            ) : (
              debts.map((debt) => {
                const payoff = calculateDebtPayoff(debt);
                return (
                  <View key={debt.id} style={styles.debtCard}>
                    <View style={styles.debtHeaderRow}>
                      <Text variant="bold" size={17} color={colors.ink}>
                        {debt.name.toUpperCase()}
                      </Text>
                      <Text variant="caption" color={colors.terracotta}>
                        {debt.interestRate}% INTEREST
                      </Text>
                    </View>

                    <DisplayNumber size={28} color={colors.terracotta} style={styles.debtRemainingNumber}>
                      {formatCurrency(debt.remainingAmount, currency)}
                    </DisplayNumber>
                    <LedgerLabel style={styles.remainingSubtext}>REMAINING PRINCIPAL</LedgerLabel>

                    <View style={styles.debtMetaRow}>
                      <Text variant="secondary" size={13}>
                        EMI: {formatCurrency(debt.minimumEmi, currency)}/mo
                      </Text>
                      <Text variant="semibold" size={13} color={colors.ink}>
                        Freedom: {payoff.freedomDateString}
                      </Text>
                    </View>

                    {/* Payoff Journey Visual */}
                    <View style={styles.payoffTimeline}>
                      <LedgerLabel style={styles.timelineLabel}>PAYOFF JOURNEY</LedgerLabel>
                      <View style={styles.timelineTrack}>
                        <View style={[styles.timelineNode, { backgroundColor: colors.ink }]} />
                        <View style={[styles.timelineLine, { backgroundColor: colors.ink }]} />
                        <View style={[styles.timelineNode, { backgroundColor: colors.chartreuse }]} />
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}
      </ScrollView>

      {/* Add Modal */}
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
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <LedgerLabel>
                {activeTab === 'budgets' ? 'ADD BUDGET TRACK' : activeTab === 'goals' ? 'CREATE GOAL JOURNEY' : 'ADD DEBT PAYOFF'}
              </LedgerLabel>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <Text variant="caption" color={colors.inkMuted}>
                  CANCEL
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'budgets' && (
              <View style={styles.formContainer}>
                <LedgerLabel style={styles.formLabel}>CATEGORY NAME</LedgerLabel>
                <TextInput
                  value={budgetName}
                  onChangeText={setBudgetName}
                  placeholder="e.g. Dining, Groceries"
                  placeholderTextColor={colors.inkSubtle}
                  style={[styles.modalInput, { backgroundColor: colors.surfaceInput, color: colors.ink }]}
                />
                <LedgerLabel style={[styles.formLabel, { marginTop: 14 }]}>MONTHLY LIMIT ({currency})</LedgerLabel>
                <TextInput
                  value={budgetLimit}
                  onChangeText={setBudgetLimit}
                  keyboardType="numeric"
                  placeholder="10000"
                  placeholderTextColor={colors.inkSubtle}
                  style={[styles.modalInput, { backgroundColor: colors.surfaceInput, color: colors.ink }]}
                />
              </View>
            )}

            {activeTab === 'goals' && (
              <View style={styles.formContainer}>
                <LedgerLabel style={styles.formLabel}>GOAL NAME</LedgerLabel>
                <TextInput
                  value={goalName}
                  onChangeText={setGoalName}
                  placeholder="e.g. Vacation, House Deposit, Car"
                  placeholderTextColor={colors.inkSubtle}
                  style={[styles.modalInput, { backgroundColor: colors.surfaceInput, color: colors.ink }]}
                />
                <LedgerLabel style={[styles.formLabel, { marginTop: 14 }]}>TARGET AMOUNT ({currency})</LedgerLabel>
                <TextInput
                  value={goalTarget}
                  onChangeText={setGoalTarget}
                  keyboardType="numeric"
                  placeholder="100000"
                  placeholderTextColor={colors.inkSubtle}
                  style={[styles.modalInput, { backgroundColor: colors.surfaceInput, color: colors.ink }]}
                />
                <LedgerLabel style={[styles.formLabel, { marginTop: 14 }]}>CURRENT SAVED ({currency})</LedgerLabel>
                <TextInput
                  value={goalCurrent}
                  onChangeText={setGoalCurrent}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.inkSubtle}
                  style={[styles.modalInput, { backgroundColor: colors.surfaceInput, color: colors.ink }]}
                />
              </View>
            )}

            {activeTab === 'debt' && (
              <View style={styles.formContainer}>
                <LedgerLabel style={styles.formLabel}>DEBT / LOAN NAME</LedgerLabel>
                <TextInput
                  value={debtName}
                  onChangeText={setDebtName}
                  placeholder="e.g. Home Loan, Education Loan"
                  placeholderTextColor={colors.inkSubtle}
                  style={[styles.modalInput, { backgroundColor: colors.surfaceInput, color: colors.ink }]}
                />
                <LedgerLabel style={[styles.formLabel, { marginTop: 14 }]}>REMAINING PRINCIPAL ({currency})</LedgerLabel>
                <TextInput
                  value={debtRemaining}
                  onChangeText={setDebtRemaining}
                  keyboardType="numeric"
                  placeholder="250000"
                  placeholderTextColor={colors.inkSubtle}
                  style={[styles.modalInput, { backgroundColor: colors.surfaceInput, color: colors.ink }]}
                />
                <LedgerLabel style={[styles.formLabel, { marginTop: 14 }]}>MONTHLY EMI ({currency})</LedgerLabel>
                <TextInput
                  value={debtEmi}
                  onChangeText={setDebtEmi}
                  keyboardType="numeric"
                  placeholder="12000"
                  placeholderTextColor={colors.inkSubtle}
                  style={[styles.modalInput, { backgroundColor: colors.surfaceInput, color: colors.ink }]}
                />
              </View>
            )}

            <Button
              title="SAVE TO LEDGER"
              size="lg"
              onPress={handleCreate}
              style={{ marginTop: 24 }}
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
  segmentedTab: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    paddingVertical: 12,
  },
  trackCard: {
    marginBottom: 20,
  },
  trackTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trackBg: {
    height: 8,
    width: '100%',
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
  },
  trackBottomRow: {
    marginTop: 6,
  },
  goalCard: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth || 1,
    borderBottomColor: '#DDD8CB',
  },
  goalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  goalAmounts: {
    marginBottom: 10,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  debtCard: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth || 1,
    borderBottomColor: '#DDD8CB',
  },
  debtHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  debtRemainingNumber: {
    lineHeight: 34,
  },
  remainingSubtext: {
    marginTop: 4,
    marginBottom: 10,
  },
  debtMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  payoffTimeline: {
    marginTop: 6,
  },
  timelineLabel: {
    marginBottom: 8,
    fontSize: 9,
  },
  timelineTrack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineNode: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timelineLine: {
    flex: 1,
    height: 2,
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
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  formContainer: {
    marginTop: 8,
  },
  formLabel: {
    marginBottom: 6,
  },
  modalInput: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 6,
    fontSize: 15,
  },
});

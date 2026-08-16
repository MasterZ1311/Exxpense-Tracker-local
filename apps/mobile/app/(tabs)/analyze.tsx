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
import { formatCurrency, AssetType } from '@fintrack/domain';

export default function AnalyzeScreen() {
  const { colors, radii } = useTheme();
  const {
    profile,
    moneyFlow,
    portfolioSummary,
    netWorthSummary,
    investments,
    addInvestment,
  } = useFinance();

  const [activeTab, setActiveTab] = useState<'spending' | 'investments' | 'networth'>('spending');
  const [isAddInvOpen, setIsAddInvOpen] = useState(false);

  const [invName, setInvName] = useState('');
  const [invType, setInvType] = useState<AssetType>('equity');
  const [invInvested, setInvInvested] = useState('');
  const [invCurrent, setInvCurrent] = useState('');

  const currency = profile?.currency || 'INR';

  const handleCreateInvestment = async () => {
    if (!invName.trim()) return;
    const invested = parseFloat(invInvested) || 10000;
    const current = parseFloat(invCurrent) || invested;

    await addInvestment({
      profileId: profile?.id || 'default',
      name: invName.trim(),
      assetType: invType,
      units: 1,
      buyPrice: invested,
      currentPrice: current,
      currency,
      investedAmount: invested,
      currentValue: current,
      returns: current - invested,
      returnsPercentage: invested > 0 ? ((current - invested) / invested) * 100 : 0,
    });

    setInvName('');
    setInvInvested('');
    setInvCurrent('');
    setIsAddInvOpen(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.paper }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <LedgerLabel style={styles.headerLabel}>INTELLIGENCE & CAPITAL</LedgerLabel>
          <EditorialHeadline size={28}>Analytics & Wealth</EditorialHeadline>
        </View>

        {/* Segmented Switcher */}
        <SegmentedControl<'spending' | 'investments' | 'networth'>
          options={[
            { value: 'spending', label: 'SPENDING' },
            { value: 'investments', label: 'PORTFOLIO' },
            { value: 'networth', label: 'NET WORTH' },
          ]}
          value={activeTab}
          onChange={setActiveTab}
          style={styles.segmentedTab}
        />

        {/* 1. Spending Review */}
        {activeTab === 'spending' && (
          <View>
            <View style={styles.section}>
              <LedgerLabel style={styles.sectionLabel}>TOTAL OUTFLOW THIS MONTH</LedgerLabel>
              <DisplayNumber size={40} color={colors.terracotta}>
                {formatCurrency(moneyFlow.expenses, currency)}
              </DisplayNumber>
              <Text variant="secondary" size={14} style={styles.subtext}>
                Retained {formatCurrency(moneyFlow.saved, currency)} ({moneyFlow.savingsRate}% savings rate)
              </Text>
            </View>

            <LedgerLine />

            <View style={styles.section}>
              <LedgerLabel style={styles.sectionLabel}>CATEGORY ALLOCATION</LedgerLabel>
              {moneyFlow.topCategories.length === 0 ? (
                <Text variant="secondary" size={14}>
                  No categorized expenses recorded for this period.
                </Text>
              ) : (
                moneyFlow.topCategories.map((item) => (
                  <View key={item.category} style={styles.allocationRow}>
                    <View style={styles.allocationHeader}>
                      <Text variant="medium" size={15} color={colors.ink}>
                        {item.category}
                      </Text>
                      <Text variant="semibold" size={15} color={colors.ink}>
                        {formatCurrency(item.amount, currency)} ({item.percentage}%)
                      </Text>
                    </View>
                    <View style={[styles.allocBarBg, { backgroundColor: colors.bone, borderRadius: radii.sm }]}>
                      <View
                        style={[
                          styles.allocBarFill,
                          {
                            width: `${item.percentage}%`,
                            backgroundColor: colors.moss,
                            borderRadius: radii.sm,
                          },
                        ]}
                      />
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        )}

        {/* 2. Portfolio / Investments (Brass Accent) */}
        {activeTab === 'investments' && (
          <View>
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <LedgerLabel style={styles.sectionLabel}>INVESTMENT PORTFOLIO</LedgerLabel>
                <TouchableOpacity onPress={() => setIsAddInvOpen(true)}>
                  <Text variant="caption" color={colors.inkMuted}>
                    + ADD ASSET
                  </Text>
                </TouchableOpacity>
              </View>

              <DisplayNumber size={40} color={colors.brass}>
                {formatCurrency(portfolioSummary.totalCurrentValue, currency)}
              </DisplayNumber>

              <View style={styles.returnsRow}>
                <Text
                  variant="semibold"
                  size={14}
                  color={portfolioSummary.totalReturns >= 0 ? colors.moss : colors.terracotta}
                >
                  {portfolioSummary.totalReturns >= 0 ? '+' : ''}
                  {formatCurrency(portfolioSummary.totalReturns, currency)} ({portfolioSummary.returnsPercentage}%)
                </Text>
                <Text variant="secondary" size={14}>
                  {' '}all-time returns
                </Text>
              </View>
            </View>

            <LedgerLine />

            {/* Asset Class Allocations */}
            <View style={styles.section}>
              <LedgerLabel style={styles.sectionLabel}>ASSET CLASS DISTRIBUTION</LedgerLabel>
              {portfolioSummary.allocations.map((alloc) => (
                <View key={alloc.assetType} style={styles.allocationRow}>
                  <View style={styles.allocationHeader}>
                    <Text variant="medium" size={15} color={colors.ink}>
                      {alloc.label}
                    </Text>
                    <Text variant="semibold" size={15} color={colors.ink}>
                      {formatCurrency(alloc.totalValue, currency)} ({alloc.percentage}%)
                    </Text>
                  </View>
                  <View style={[styles.allocBarBg, { backgroundColor: colors.bone, borderRadius: radii.sm }]}>
                    <View
                      style={[
                        styles.allocBarFill,
                        {
                          width: `${alloc.percentage}%`,
                          backgroundColor: alloc.color,
                          borderRadius: radii.sm,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>

            <LedgerLine />

            {/* Holdings List */}
            <View style={styles.section}>
              <LedgerLabel style={styles.sectionLabel}>HOLDINGS</LedgerLabel>
              {investments.map((inv) => (
                <View key={inv.id} style={styles.holdingRow}>
                  <View style={styles.holdingInfo}>
                    <Text variant="semibold" size={15} color={colors.ink}>
                      {inv.name}
                    </Text>
                    <Text variant="caption" color={colors.inkMuted}>
                      {inv.assetType.toUpperCase()} · Invested {formatCurrency(inv.investedAmount, currency)}
                    </Text>
                  </View>
                  <View style={styles.holdingValues}>
                    <Text variant="semibold" size={15} color={colors.ink}>
                      {formatCurrency(inv.currentValue, currency)}
                    </Text>
                    <Text
                      variant="caption"
                      color={inv.returns >= 0 ? colors.moss : colors.terracotta}
                    >
                      {inv.returns >= 0 ? '+' : ''}{inv.returnsPercentage}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 3. Net Worth Long-Term Journey */}
        {activeTab === 'networth' && (
          <View>
            <View style={styles.section}>
              <LedgerLabel style={styles.sectionLabel}>ESTIMATED NET WORTH</LedgerLabel>
              <DisplayNumber size={40} color={colors.ink}>
                {formatCurrency(netWorthSummary.netWorth, currency)}
              </DisplayNumber>
              <View style={styles.returnsRow}>
                <Text variant="semibold" size={14} color={colors.moss}>
                  ↑ {formatCurrency(netWorthSummary.yearlyGrowth, currency)} ({netWorthSummary.growthPercentage}%)
                </Text>
                <Text variant="secondary" size={14}>
                  {' '}this year
                </Text>
              </View>
            </View>

            <LedgerLine />

            {/* Balance Sheet Breakdown (Assets vs Liabilities) */}
            <View style={styles.section}>
              <LedgerLabel style={styles.sectionLabel}>BALANCE SHEET</LedgerLabel>
              <View style={styles.balanceSheetRow}>
                <View style={styles.bsBlock}>
                  <LedgerLabel style={styles.bsLabel}>TOTAL ASSETS</LedgerLabel>
                  <DisplayNumber size={26} color={colors.moss}>
                    {formatCurrency(netWorthSummary.totalAssets, currency, { compact: true })}
                  </DisplayNumber>
                  <Text variant="caption" color={colors.inkSubtle}>
                    Cash & Portfolio
                  </Text>
                </View>

                <View style={styles.bsDivider} />

                <View style={styles.bsBlock}>
                  <LedgerLabel style={styles.bsLabel}>LIABILITIES</LedgerLabel>
                  <DisplayNumber size={26} color={colors.terracotta}>
                    {formatCurrency(netWorthSummary.totalLiabilities, currency, { compact: true })}
                  </DisplayNumber>
                  <Text variant="caption" color={colors.inkSubtle}>
                    Debts & Credit
                  </Text>
                </View>
              </View>
            </View>

            <LedgerLine />

            {/* 12-Month Trajectory */}
            <View style={styles.section}>
              <LedgerLabel style={styles.sectionLabel}>12 MONTH JOURNEY</LedgerLabel>
              <View style={styles.journeyGrid}>
                {netWorthSummary.historyPoints.map((pt) => (
                  <View key={pt.month} style={styles.journeyPoint}>
                    <Text variant="caption" color={colors.inkMuted} style={styles.pointMonth}>
                      {pt.month}
                    </Text>
                    <Text variant="semibold" size={11} color={colors.ink}>
                      {formatCurrency(pt.netWorth, currency, { compact: true })}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Add Investment Modal */}
      <Modal
        visible={isAddInvOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddInvOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setIsAddInvOpen(false)}
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
              <LedgerLabel>ADD INVESTMENT HOLDING</LedgerLabel>
              <TouchableOpacity onPress={() => setIsAddInvOpen(false)}>
                <Text variant="caption" color={colors.inkMuted}>
                  CANCEL
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <LedgerLabel style={styles.formLabel}>ASSET NAME</LedgerLabel>
              <TextInput
                value={invName}
                onChangeText={setInvName}
                placeholder="e.g. S&P 500 Index, Physical Gold, Bitcoin"
                placeholderTextColor={colors.inkSubtle}
                style={[styles.modalInput, { backgroundColor: colors.surfaceInput, color: colors.ink }]}
              />

              <LedgerLabel style={[styles.formLabel, { marginTop: 14 }]}>INVESTED AMOUNT ({currency})</LedgerLabel>
              <TextInput
                value={invInvested}
                onChangeText={setInvInvested}
                keyboardType="numeric"
                placeholder="25000"
                placeholderTextColor={colors.inkSubtle}
                style={[styles.modalInput, { backgroundColor: colors.surfaceInput, color: colors.ink }]}
              />

              <LedgerLabel style={[styles.formLabel, { marginTop: 14 }]}>CURRENT MARKET VALUE ({currency})</LedgerLabel>
              <TextInput
                value={invCurrent}
                onChangeText={setInvCurrent}
                keyboardType="numeric"
                placeholder="30000"
                placeholderTextColor={colors.inkSubtle}
                style={[styles.modalInput, { backgroundColor: colors.surfaceInput, color: colors.ink }]}
              />
            </View>

            <Button
              title="SAVE ASSET HOLDING"
              size="lg"
              onPress={handleCreateInvestment}
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
    paddingVertical: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    marginBottom: 8,
  },
  subtext: {
    marginTop: 6,
  },
  returnsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  allocationRow: {
    marginBottom: 16,
  },
  allocationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  allocBarBg: {
    height: 8,
    width: '100%',
    overflow: 'hidden',
  },
  allocBarFill: {
    height: '100%',
  },
  holdingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth || 1,
    borderBottomColor: '#DDD8CB',
  },
  holdingInfo: {
    flex: 1,
  },
  holdingValues: {
    alignItems: 'flex-end',
  },
  balanceSheetRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
  },
  bsBlock: {
    flex: 1,
    alignItems: 'center',
  },
  bsLabel: {
    marginBottom: 6,
    fontSize: 9,
  },
  bsDivider: {
    width: 1,
    height: 48,
    backgroundColor: '#DDD8CB',
  },
  journeyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  journeyPoint: {
    width: '23%',
    alignItems: 'center',
    paddingVertical: 6,
    marginBottom: 8,
  },
  pointMonth: {
    marginBottom: 2,
    fontSize: 10,
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

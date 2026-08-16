import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, LayoutChangeEvent } from 'react-native';
import Svg, { Path, Rect, G, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { DisplayNumber, Text, LedgerLabel } from '../../components/Typography';
import { LedgerLine } from '../../components/LedgerLine';
import { MoneyFlowSummary, formatCurrency } from '@fintrack/domain';

interface MoneyFlowRibbonProps {
  summary: MoneyFlowSummary;
  currency?: string;
}

export const MoneyFlowRibbon: React.FC<MoneyFlowRibbonProps> = ({
  summary,
  currency = 'INR',
}) => {
  const { colors, spacing, radii } = useTheme();
  const [selectedSegment, setSelectedSegment] = useState<'all' | 'income' | 'expenses' | 'saved'>('all');
  const [containerWidth, setContainerWidth] = useState<number>(340);

  const onLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > 0) setContainerWidth(width);
  };

  const totalVolume = Math.max(1, summary.income + summary.expenses);
  const incomeWidth = Math.max(20, (summary.income / totalVolume) * (containerWidth - 8));
  const expenseWidth = Math.max(20, (summary.expenses / totalVolume) * (containerWidth - 8));
  const savedWidth = summary.income > summary.expenses
    ? Math.max(10, ((summary.income - summary.expenses) / summary.income) * (containerWidth - 8))
    : 0;

  const ribbonHeight = 36;

  return (
    <View style={styles.container} onLayout={onLayout}>
      <View style={styles.headerRow}>
        <LedgerLabel>MONEY FLOW · THIS MONTH</LedgerLabel>
        <Text variant="caption" color={colors.inkMuted}>
          {summary.savingsRate}% SAVED
        </Text>
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setSelectedSegment(selectedSegment === 'income' ? 'all' : 'income')}
          style={[
            styles.metricBlock,
            selectedSegment === 'income' && { opacity: 1 },
          ]}
        >
          <View style={styles.labelWithDot}>
            <View style={[styles.dot, { backgroundColor: colors.moss }]} />
            <LedgerLabel style={styles.flowLabel}>INCOME</LedgerLabel>
          </View>
          <Text variant="semibold" size={16} color={colors.ink}>
            {formatCurrency(summary.income, currency)}
          </Text>
        </TouchableOpacity>

        <View style={styles.verticalDivider} />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setSelectedSegment(selectedSegment === 'expenses' ? 'all' : 'expenses')}
          style={[
            styles.metricBlock,
            selectedSegment === 'expenses' && { opacity: 1 },
          ]}
        >
          <View style={styles.labelWithDot}>
            <View style={[styles.dot, { backgroundColor: colors.terracotta }]} />
            <LedgerLabel style={styles.flowLabel}>OUTFLOW</LedgerLabel>
          </View>
          <Text variant="semibold" size={16} color={colors.ink}>
            {formatCurrency(summary.expenses, currency)}
          </Text>
        </TouchableOpacity>

        <View style={styles.verticalDivider} />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setSelectedSegment(selectedSegment === 'saved' ? 'all' : 'saved')}
          style={[
            styles.metricBlock,
            selectedSegment === 'saved' && { opacity: 1 },
          ]}
        >
          <View style={styles.labelWithDot}>
            <View style={[styles.dot, { backgroundColor: colors.chartreuse }]} />
            <LedgerLabel style={styles.flowLabel}>SAVED</LedgerLabel>
          </View>
          <Text variant="semibold" size={16} color={colors.ink}>
            {formatCurrency(summary.saved, currency)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Distinctive Flow Ribbon (SVG) */}
      <View style={styles.ribbonWrapper}>
        <Svg width={containerWidth} height={ribbonHeight}>
          {/* Background track */}
          <Rect
            x={0}
            y={0}
            width={containerWidth}
            height={ribbonHeight}
            rx={radii.sm}
            fill={colors.bone}
          />
          {/* Income segment */}
          <Rect
            x={0}
            y={0}
            width={Math.min(containerWidth, incomeWidth)}
            height={ribbonHeight}
            rx={radii.sm}
            fill={colors.moss}
            opacity={selectedSegment === 'all' || selectedSegment === 'income' ? 0.9 : 0.35}
          />
          {/* Expense segment overlapping / flowing */}
          {summary.expenses > 0 && (
            <Rect
              x={Math.max(0, containerWidth - expenseWidth)}
              y={0}
              width={expenseWidth}
              height={ribbonHeight}
              rx={radii.sm}
              fill={colors.terracotta}
              opacity={selectedSegment === 'all' || selectedSegment === 'expenses' ? 0.85 : 0.35}
            />
          )}
          {/* Flow curve connecting nodes */}
          <Path
            d={`M ${incomeWidth * 0.4} ${ribbonHeight} Q ${containerWidth / 2} ${ribbonHeight / 2} ${containerWidth - expenseWidth * 0.4} 0`}
            stroke={colors.chartreuse}
            strokeWidth={2.5}
            fill="none"
            opacity={0.8}
          />
        </Svg>
      </View>

      {/* Top Categories direct breakdown */}
      {summary.topCategories.length > 0 && (
        <View style={styles.categoriesSection}>
          <LedgerLine style={styles.categoryDivider} />
          {summary.topCategories.slice(0, 3).map((item) => (
            <View key={item.category} style={styles.categoryRow}>
              <View style={styles.categoryInfo}>
                <Text variant="medium" size={14} color={colors.ink}>
                  {item.category}
                </Text>
                <Text variant="caption" color={colors.inkMuted}>
                  {item.percentage}% of spending
                </Text>
              </View>
              <Text variant="semibold" size={14} color={colors.terracotta}>
                -{formatCurrency(item.amount, currency)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  metricBlock: {
    flex: 1,
  },
  labelWithDot: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  flowLabel: {
    fontSize: 9,
  },
  verticalDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#DDD8CB',
    marginHorizontal: 8,
    marginTop: 4,
  },
  ribbonWrapper: {
    marginVertical: 6,
    borderRadius: 6,
    overflow: 'hidden',
  },
  categoriesSection: {
    marginTop: 12,
  },
  categoryDivider: {
    marginBottom: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  categoryInfo: {
    flex: 1,
  },
});

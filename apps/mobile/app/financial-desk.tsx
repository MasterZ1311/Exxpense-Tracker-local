import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { useFinance } from '../src/state/FinanceContext';
import { Text, LedgerLabel, EditorialHeadline } from '../src/components/Typography';
import { LedgerLine } from '../src/components/LedgerLine';
import { Button } from '../src/components/Button';
import { FinancialDeskQueryResponse } from '@fintrack/domain';

export default function FinancialDeskScreen() {
  const { colors, typography, radii } = useTheme();
  const { askFinancialDesk, profile } = useFinance();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<FinancialDeskQueryResponse | null>(() => {
    return askFinancialDesk('Where did my money go this month?');
  });

  const promptSuggestions = [
    'Where did my money go this month?',
    `Can I afford ${profile?.currency === 'INR' ? '₹20,000' : '$2,000'}?`,
    'Weekend spending velocity',
    'Overall financial pulse',
  ];

  const handleAsk = (q: string) => {
    if (!q.trim()) return;
    const res = askFinancialDesk(q);
    setResponse(res);
    setQuery('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.paper }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <LedgerLabel style={styles.headerLabel}>OIKOS INTELLIGENCE</LedgerLabel>
            <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text variant="caption" color={colors.inkMuted}>
                CLOSE
              </Text>
            </TouchableOpacity>
          </View>
          <EditorialHeadline size={28}>Financial Desk</EditorialHeadline>
          <Text variant="secondary" size={15} style={styles.subtitle}>
            Your numbers, interpreted.
          </Text>
        </View>

        <LedgerLine />

        {/* Input Bar */}
        <View style={styles.inputSection}>
          <LedgerLabel style={styles.inputLabel}>WHAT WOULD YOU LIKE TO UNDERSTAND?</LedgerLabel>
          <View style={styles.inputRow}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="e.g. Can I afford ₹25,000?"
              placeholderTextColor={colors.inkSubtle}
              onSubmitEditing={() => handleAsk(query)}
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
            <Button
              title="→"
              size="md"
              onPress={() => handleAsk(query)}
              style={styles.submitBtn}
            />
          </View>

          {/* Contextual Prompt Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
          >
            {promptSuggestions.map((prompt) => (
              <TouchableOpacity
                key={prompt}
                onPress={() => handleAsk(prompt)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: colors.bone,
                    borderRadius: radii.sm,
                    borderColor: colors.border,
                    borderWidth: 1,
                  },
                ]}
              >
                <Text variant="body" size={12} color={colors.ink}>
                  {prompt}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <LedgerLine />

        {/* Precision Analyst Report Output */}
        {response && (
          <View style={styles.reportSection}>
            <LedgerLabel style={styles.reportHeaderLabel}>ANALYST REPORT</LedgerLabel>
            <EditorialHeadline size={24} style={styles.reportHeadline}>
              {response.headline}
            </EditorialHeadline>

            {response.keyMetric && (
              <View style={[styles.metricCard, { backgroundColor: colors.bone, borderRadius: radii.sm }]}>
                <LedgerLabel style={styles.metricLabel}>KEY METRIC</LedgerLabel>
                <Text variant="bold" size={20} color={colors.ink}>
                  {response.keyMetric}
                </Text>
              </View>
            )}

            <Text variant="body" size={15} color={colors.ink} style={styles.summaryText}>
              {response.summary}
            </Text>

            {/* Insights Checklist */}
            <View style={styles.insightsBlock}>
              <LedgerLabel style={styles.insightsLabel}>OBSERVATIONS</LedgerLabel>
              {response.insights.map((insight, idx) => (
                <View key={idx} style={styles.insightItem}>
                  <Text variant="semibold" size={14} color={colors.moss} style={styles.bullet}>
                    —
                  </Text>
                  <Text variant="secondary" size={14} style={styles.insightText}>
                    {insight}
                  </Text>
                </View>
              ))}
            </View>

            {response.recommendation && (
              <View style={[styles.recBlock, { backgroundColor: colors.softMoss, borderRadius: radii.sm }]}>
                <LedgerLabel style={styles.recLabel}>ACTIONABLE RECOMMENDATION</LedgerLabel>
                <Text variant="medium" size={14} color={colors.ink} style={styles.recText}>
                  {response.recommendation}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerLabel: {
    marginBottom: 2,
  },
  subtitle: {
    marginTop: 4,
  },
  inputSection: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  inputLabel: {
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginRight: 8,
  },
  submitBtn: {
    minWidth: 44,
  },
  chipsScroll: {
    marginTop: 12,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  reportSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  reportHeaderLabel: {
    marginBottom: 6,
  },
  reportHeadline: {
    marginBottom: 14,
  },
  metricCard: {
    padding: 14,
    marginBottom: 16,
  },
  metricLabel: {
    marginBottom: 4,
    fontSize: 9,
  },
  summaryText: {
    lineHeight: 22,
    marginBottom: 18,
  },
  insightsBlock: {
    marginBottom: 20,
  },
  insightsLabel: {
    marginBottom: 10,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    marginRight: 8,
  },
  insightText: {
    flex: 1,
    lineHeight: 20,
  },
  recBlock: {
    padding: 16,
  },
  recLabel: {
    marginBottom: 6,
    fontSize: 9,
  },
  recText: {
    lineHeight: 20,
  },
});

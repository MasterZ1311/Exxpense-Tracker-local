import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { useFinance } from '../src/state/FinanceContext';
import { Text, LedgerLabel, EditorialHeadline } from '../src/components/Typography';
import { LedgerLine } from '../src/components/LedgerLine';
import { Button } from '../src/components/Button';
import { formatCurrency, parseBankStatementCsv, ParsedCsvTransaction } from '@fintrack/domain';

const SAMPLE_CSV = `Date,Description,Category,Type,Amount
2026-08-10,Starbucks Reserve,Food & Dining,EXPENSE,450.00
2026-08-11,Shell Fuel Station,Transport,EXPENSE,2400.00
2026-08-12,Amazon Online Shopping,Shopping,EXPENSE,1899.00
2026-08-14,Airtel Fiber Broadband,Bills & Utilities,EXPENSE,1199.00
2026-08-15,Consulting Client Retainer,Salary,INCOME,45000.00`;

export default function ImportStatementScreen() {
  const { colors, radii, typography } = useTheme();
  const { profile, accounts, addTransaction } = useFinance();
  const router = useRouter();

  const [stage, setStage] = useState<'select' | 'read' | 'review' | 'imported'>('select');
  const [selectedFormat, setSelectedFormat] = useState<'CSV' | 'PDF' | 'PASTE'>('CSV');
  const [rawInput, setRawInput] = useState(SAMPLE_CSV);
  const [parsedBatch, setParsedBatch] = useState<ParsedCsvTransaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartRead = () => {
    setStage('read');
    setIsProcessing(true);

    setTimeout(() => {
      const parsed = parseBankStatementCsv(rawInput);
      setParsedBatch(parsed);
      setIsProcessing(false);
      setStage('review');
    }, 900);
  };

  const handleCommitImport = async () => {
    setIsProcessing(true);
    const accountId = accounts[0]?.id || 'default';
    const profileId = profile?.id || 'default';

    for (const item of parsedBatch) {
      await addTransaction({
        profileId,
        accountId,
        currency: profile?.currency || 'INR',
        date: item.date,
        description: item.description,
        amount: item.amount,
        type: item.type,
        category: item.category,
        notes: item.notes,
      });
    }

    setIsProcessing(false);
    setStage('imported');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.paper }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <LedgerLabel style={styles.headerLabel}>DATA INTAKE PIPELINE</LedgerLabel>
            <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text variant="caption" color={colors.inkMuted}>
                CLOSE
              </Text>
            </TouchableOpacity>
          </View>
          <EditorialHeadline size={28}>Import Statement</EditorialHeadline>
        </View>

        {/* 4-Stage Pipeline Tracker */}
        <View style={styles.pipelineTracker}>
          {[
            { id: 'select', label: '01 SELECT' },
            { id: 'read', label: '02 READ' },
            { id: 'review', label: '03 REVIEW' },
            { id: 'imported', label: '04 IMPORT' },
          ].map((st) => {
            const isCurrent = stage === st.id;
            return (
              <View key={st.id} style={styles.stepItem}>
                <Text
                  variant={isCurrent ? 'semibold' : 'caption'}
                  size={11}
                  color={isCurrent ? colors.ink : colors.inkSubtle}
                >
                  {st.label}
                </Text>
                {isCurrent && <View style={[styles.activeUnderline, { backgroundColor: colors.chartreuse }]} />}
              </View>
            );
          })}
        </View>

        <LedgerLine />

        {/* Stage 1: SELECT & INPUT */}
        {stage === 'select' && (
          <View style={styles.section}>
            <LedgerLabel style={styles.sectionLabel}>INPUT METHOD</LedgerLabel>
            <Text variant="secondary" size={14} style={styles.description}>
              Paste bank CSV data or edit the sample statement below to parse and normalize into your SQLite ledger.
            </Text>

            <View style={styles.formatRow}>
              {(['CSV', 'PASTE'] as const).map((fmt) => (
                <TouchableOpacity
                  key={fmt}
                  onPress={() => setSelectedFormat(fmt)}
                  style={[
                    styles.formatBtn,
                    {
                      backgroundColor: selectedFormat === fmt ? colors.ink : colors.bone,
                      borderRadius: radii.sm,
                    },
                  ]}
                >
                  <Text
                    variant={selectedFormat === fmt ? 'semibold' : 'body'}
                    size={14}
                    color={selectedFormat === fmt ? colors.paper : colors.ink}
                  >
                    {fmt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <LedgerLabel style={[styles.sectionLabel, { marginTop: 16 }]}>STATEMENT CSV DATA</LedgerLabel>
            <TextInput
              value={rawInput}
              onChangeText={setRawInput}
              multiline
              numberOfLines={6}
              placeholder="Date,Description,Amount..."
              placeholderTextColor={colors.inkSubtle}
              style={[
                styles.csvInput,
                {
                  backgroundColor: colors.surfaceInput,
                  color: colors.ink,
                  fontFamily: typography.fonts.sans,
                  borderRadius: radii.sm,
                  borderColor: colors.border,
                },
              ]}
            />

            <Button
              title="PARSE STATEMENT RECORDS →"
              size="lg"
              onPress={handleStartRead}
              style={{ marginTop: 24 }}
            />
          </View>
        )}

        {/* Stage 2: READ */}
        {stage === 'read' && (
          <View style={styles.section}>
            <LedgerLabel style={styles.sectionLabel}>PIPELINE STATUS</LedgerLabel>
            <EditorialHeadline size={22} style={styles.readingTitle}>
              Parsing statement records...
            </EditorialHeadline>
            <Text variant="secondary" size={14}>
              Executing delimiter auto-detection, column mapping, and categorization algorithms.
            </Text>
          </View>
        )}

        {/* Stage 3: REVIEW */}
        {stage === 'review' && (
          <View style={styles.section}>
            <LedgerLabel style={styles.sectionLabel}>SUMMARY FOUND</LedgerLabel>
            <EditorialHeadline size={22} style={styles.readingTitle}>
              {parsedBatch.length} Transactions Normalized
            </EditorialHeadline>
            <Text variant="secondary" size={14} style={styles.description}>
              All entries categorized and ready to commit to your SQLite ledger.
            </Text>

            <View style={styles.batchList}>
              {parsedBatch.map((tx, idx) => (
                <View key={idx} style={styles.batchRow}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text variant="medium" size={14} color={colors.ink}>
                      {tx.description}
                    </Text>
                    <Text variant="caption" color={colors.inkMuted}>
                      {tx.category} · {tx.date.split('T')[0]}
                    </Text>
                  </View>
                  <Text
                    variant="semibold"
                    size={14}
                    color={tx.type === 'income' ? colors.moss : colors.terracotta}
                  >
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, profile?.currency)}
                  </Text>
                </View>
              ))}
            </View>

            <Button
              title="COMMIT ALL TO LEDGER"
              size="lg"
              loading={isProcessing}
              onPress={handleCommitImport}
              style={{ marginTop: 24 }}
            />
          </View>
        )}

        {/* Stage 4: IMPORTED */}
        {stage === 'imported' && (
          <View style={styles.section}>
            <LedgerLabel style={styles.sectionLabel}>IMPORT COMPLETE</LedgerLabel>
            <EditorialHeadline size={22} style={styles.readingTitle}>
              Ledger Synchronized
            </EditorialHeadline>
            <Text variant="secondary" size={14} style={styles.description}>
              {parsedBatch.length} transactions have been committed to local SQLite and balance aggregates have been updated.
            </Text>
            <Button
              title="RETURN TO HOME →"
              size="lg"
              onPress={() => router.replace('/(tabs)')}
              style={{ marginTop: 20 }}
            />
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
  pipelineTracker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  stepItem: {
    alignItems: 'center',
  },
  activeUnderline: {
    height: 2,
    width: '100%',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionLabel: {
    marginBottom: 8,
  },
  description: {
    lineHeight: 20,
    marginBottom: 16,
  },
  formatRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 8,
  },
  formatBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  csvInput: {
    padding: 12,
    fontSize: 13,
    borderWidth: 1,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  readingTitle: {
    marginBottom: 8,
  },
  batchList: {
    marginTop: 12,
  },
  batchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth || 1,
    borderBottomColor: '#DDD8CB',
  },
});

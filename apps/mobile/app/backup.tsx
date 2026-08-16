import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { useFinance } from '../src/state/FinanceContext';
import { Text, LedgerLabel, EditorialHeadline } from '../src/components/Typography';
import { LedgerLine } from '../src/components/LedgerLine';
import { Button } from '../src/components/Button';

export default function BackupScreen() {
  const { colors, typography, radii } = useTheme();
  const { exportBackupJson, importBackupJson, resetAllData } = useFinance();
  const router = useRouter();

  const [exportedJson, setExportedJson] = useState<string>('');
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleExport = () => {
    try {
      const json = exportBackupJson();
      setExportedJson(json);
      setStatusMessage('Backup generated successfully.');
    } catch (e: any) {
      setStatusMessage(e.message || 'Export failed.');
    }
  };

  const handleImport = async () => {
    if (!importJsonText.trim()) {
      setStatusMessage('Please paste valid JSON backup data.');
      return;
    }

    try {
      await importBackupJson(importJsonText.trim());
      setStatusMessage('Backup successfully restored.');
      setImportJsonText('');
    } catch (e: any) {
      setStatusMessage(`Restore error: ${e.message}`);
    }
  };

  const handleReset = async () => {
    await resetAllData();
    router.replace('/onboarding');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.paper }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <LedgerLabel style={styles.headerLabel}>DATA OWNERSHIP</LedgerLabel>
            <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text variant="caption" color={colors.inkMuted}>
                CLOSE
              </Text>
            </TouchableOpacity>
          </View>
          <EditorialHeadline size={28}>Backup & Restore</EditorialHeadline>
          <Text variant="secondary" size={15} style={styles.subtitle}>
            Your ledger is stored locally on this device.
          </Text>
        </View>

        <LedgerLine />

        {/* Export Section */}
        <View style={styles.section}>
          <LedgerLabel style={styles.sectionLabel}>EXPORT LEDGER (JSON)</LedgerLabel>
          <Text variant="secondary" size={14} style={styles.description}>
            Generate a portable, unencrypted or encrypted snapshot of all accounts, transactions, budgets, goals, and portfolio holdings.
          </Text>
          <Button
            title="GENERATE JSON BACKUP"
            variant="primary"
            onPress={handleExport}
            style={styles.actionBtn}
          />
          {exportedJson ? (
            <TextInput
              value={exportedJson}
              editable={false}
              multiline
              style={[
                styles.jsonBox,
                { backgroundColor: colors.surfaceInput, color: colors.ink, borderRadius: radii.sm },
              ]}
            />
          ) : null}
        </View>

        <LedgerLine />

        {/* Restore Section */}
        <View style={styles.section}>
          <LedgerLabel style={styles.sectionLabel}>RESTORE FROM BACKUP</LedgerLabel>
          <Text variant="secondary" size={14} style={styles.description}>
            Paste a previously exported FinTrack backup JSON payload to restore state.
          </Text>
          <TextInput
            value={importJsonText}
            onChangeText={setImportJsonText}
            placeholder="Paste backup JSON here..."
            placeholderTextColor={colors.inkSubtle}
            multiline
            style={[
              styles.jsonInput,
              { backgroundColor: colors.surfaceInput, color: colors.ink, borderRadius: radii.sm },
            ]}
          />
          <Button
            title="RESTORE LEDGER"
            variant="secondary"
            onPress={handleImport}
            style={styles.actionBtn}
          />
        </View>

        {statusMessage && (
          <View style={styles.statusBox}>
            <Text variant="medium" size={14} color={colors.moss}>
              {statusMessage}
            </Text>
          </View>
        )}

        <LedgerLine />

        {/* Factory Reset */}
        <View style={styles.section}>
          <LedgerLabel style={styles.sectionLabel}>FACTORY RESET</LedgerLabel>
          <Text variant="secondary" size={14} style={styles.description}>
            Erase all SQLite tables and start fresh. This action cannot be undone.
          </Text>
          <Button
            title="PURGE ALL LOCAL DATA"
            variant="danger"
            onPress={handleReset}
            style={styles.actionBtn}
          />
        </View>
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
  actionBtn: {
    alignSelf: 'flex-start',
  },
  jsonBox: {
    marginTop: 16,
    height: 140,
    padding: 12,
    fontSize: 12,
    fontFamily: 'monospace',
  },
  jsonInput: {
    height: 100,
    padding: 12,
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 14,
  },
  statusBox: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
});

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Modal, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { useFinance } from '../../src/state/FinanceContext';
import { useSecurity } from '../../src/security/SecurityContext';
import { Text, LedgerLabel, EditorialHeadline } from '../../src/components/Typography';
import { LedgerLine } from '../../src/components/LedgerLine';
import { Button } from '../../src/components/Button';
import { AddCategoryModal } from '../../src/features/categories/AddCategoryModal';
import { shareCsvFile } from '../../src/utils/fileSharing';
import { ThemeType } from '../../src/theme';

export default function MoreScreen() {
  const { colors, theme, setTheme, radii } = useTheme();
  const { profile, categories, addCategory, exportCsvString, transactions } = useFinance();
  const {
    isBiometricsSupported,
    isBiometricsEnabled,
    biometricTypeName,
    toggleBiometrics,
    lockApp,
  } = useSecurity();
  const router = useRouter();

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSharingCsv, setIsSharingCsv] = useState(false);
  const [csvStatusMessage, setCsvStatusMessage] = useState<string | null>(null);

  const handleShareCsv = async () => {
    try {
      setIsSharingCsv(true);
      const csv = exportCsvString();
      const dateStr = new Date().toISOString().split('T')[0];
      await shareCsvFile(`fintrack_ledger_${dateStr}`, csv);
      setCsvStatusMessage(`Exported ${transactions.length} rows to CSV share sheet.`);
      setTimeout(() => setCsvStatusMessage(null), 4000);
    } catch (e: any) {
      Alert.alert('Export Failed', e.message);
    } finally {
      setIsSharingCsv(false);
    }
  };

  const handleToggleBiometrics = async (val: boolean) => {
    const success = await toggleBiometrics(val);
    if (!success && val) {
      Alert.alert('Authentication Failed', `Could not enable ${biometricTypeName}.`);
    }
  };

  const sections = [
    {
      title: 'INTELLIGENCE & ANALYSIS',
      items: [
        { label: 'Financial Desk (AI Analyst)', route: '/financial-desk' },
      ],
    },
    {
      title: 'DATA MANAGEMENT',
      items: [
        { label: 'Backup & Restore (JSON)', route: '/backup' },
        { label: 'Import Statement (CSV/PDF)', route: '/import' },
      ],
    },
    {
      title: 'FINANCIAL TOOLS',
      items: [
        { label: 'Investment Portfolio', route: '/(tabs)/analyze' },
        { label: 'Net Worth Balance Sheet', route: '/(tabs)/analyze' },
        { label: 'Debt Payoff Journeys', route: '/(tabs)/plan' },
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.paper }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <LedgerLabel style={styles.headerLabel}>SYSTEM & PREFERENCES</LedgerLabel>
          <EditorialHeadline size={28}>More</EditorialHeadline>
        </View>

        <LedgerLine />

        {/* Security & Biometrics Section */}
        <View style={styles.section}>
          <LedgerLabel style={styles.sectionLabel}>PRIVACY & BIOMETRIC SECURITY</LedgerLabel>
          <View style={styles.switchRow}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text variant="medium" size={15} color={colors.ink}>
                Require {biometricTypeName} Lock
              </Text>
              <Text variant="caption" color={colors.inkMuted} style={{ marginTop: 2 }}>
                {isBiometricsSupported
                  ? `Prompt ${biometricTypeName} when opening or switching to FinTrack Pro.`
                  : 'Hardware biometrics not supported or not enrolled on this device.'}
              </Text>
            </View>
            <Switch
              value={isBiometricsEnabled}
              onValueChange={handleToggleBiometrics}
              disabled={!isBiometricsSupported}
              trackColor={{ false: colors.bone, true: colors.moss }}
              thumbColor={isBiometricsEnabled ? colors.paper : colors.inkSubtle}
            />
          </View>

          {isBiometricsEnabled && (
            <TouchableOpacity
              onPress={lockApp}
              style={[styles.lockNowBtn, { backgroundColor: colors.bone, borderColor: colors.border }]}
            >
              <Text variant="semibold" size={12} color={colors.ink}>
                🔒 LOCK APP NOW
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <LedgerLine />

        {/* Appearance Mode Selector */}
        <View style={styles.section}>
          <LedgerLabel style={styles.sectionLabel}>APPEARANCE THEME</LedgerLabel>
          <View style={styles.themeRow}>
            {(['light', 'dark', 'oled'] as ThemeType[]).map((t) => {
              const isSelected = theme === t;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => setTheme(t)}
                  style={[
                    styles.themeBtn,
                    {
                      backgroundColor: isSelected ? colors.ink : colors.bone,
                      borderColor: colors.border,
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Text
                    variant={isSelected ? 'semibold' : 'body'}
                    size={13}
                    color={isSelected ? colors.paper : colors.ink}
                    style={{ textTransform: 'uppercase' }}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <LedgerLine />

        {/* Category Management */}
        <View style={styles.section}>
          <View style={styles.categoryHeader}>
            <LedgerLabel style={styles.sectionLabel}>CATEGORIES ({categories.length})</LedgerLabel>
            <TouchableOpacity onPress={() => setIsCategoryModalOpen(true)}>
              <Text variant="semibold" size={12} color={colors.moss}>
                + NEW CATEGORY
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryPills}>
            {categories.map((c) => (
              <View
                key={c.id}
                style={[
                  styles.categoryPill,
                  { backgroundColor: colors.bone, borderColor: colors.border, borderWidth: 1 },
                ]}
              >
                <View style={[styles.categoryDot, { backgroundColor: c.color }]} />
                <Text variant="body" size={13} color={colors.ink}>
                  {c.name}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <LedgerLine />

        {/* Direct CSV Export Engine with Native Sharing */}
        <View style={styles.section}>
          <LedgerLabel style={styles.sectionLabel}>DIRECT CSV EXPORT</LedgerLabel>
          <Text variant="secondary" size={13} style={{ marginBottom: 12 }}>
            Share all {transactions.length} ledger transactions to standard CSV via AirDrop, Google Drive, WhatsApp, or Files.
          </Text>
          <Button
            title="SHARE CSV TO DEVICE / APPS"
            size="md"
            variant="secondary"
            loading={isSharingCsv}
            onPress={handleShareCsv}
          />
          {csvStatusMessage && (
            <Text variant="caption" color={colors.moss} style={{ marginTop: 8 }}>
              ✓ {csvStatusMessage}
            </Text>
          )}
        </View>

        <LedgerLine />

        {/* Feature Groups */}
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <LedgerLabel style={styles.sectionLabel}>{section.title}</LedgerLabel>
            {section.items.map((item) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => router.push(item.route as any)}
                style={styles.menuRow}
                activeOpacity={0.7}
              >
                <Text variant="medium" size={15} color={colors.ink}>
                  {item.label}
                </Text>
                <Text variant="caption" color={colors.inkSubtle}>
                  →
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Version info */}
        <View style={styles.footer}>
          <Text variant="caption" color={colors.inkSubtle}>
            FinTrack Pro Mobile v1.0.0 · Zero-Backend Local SQLite · Native Privacy
          </Text>
        </View>
      </ScrollView>

      {/* Add Custom Category Modal */}
      <Modal
        visible={isCategoryModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCategoryModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setIsCategoryModalOpen(false)}
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
            <AddCategoryModal
              onSave={async (cat) => {
                await addCategory(cat);
                setIsCategoryModalOpen(false);
              }}
              onCancel={() => setIsCategoryModalOpen(false)}
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
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionLabel: {
    marginBottom: 10,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  lockNowBtn: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  themeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  themeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryPills: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 6,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth || 1,
    borderBottomColor: '#DDD8CB',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
    alignItems: 'center',
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
    maxHeight: '85%',
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

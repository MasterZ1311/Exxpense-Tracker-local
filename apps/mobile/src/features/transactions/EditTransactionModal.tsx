import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Text, LedgerLabel } from '../../components/Typography';
import { SegmentedControl } from '../../components/SegmentedControl';
import { Button } from '../../components/Button';
import {
  Transaction,
  TransactionType,
  Account,
  Category,
  getCurrencySymbol,
} from '@fintrack/domain';

interface EditTransactionModalProps {
  transaction: Transaction | null;
  accounts: Account[];
  categories: Category[];
  currency?: string;
  onUpdate: (tx: Transaction) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onCancel: () => void;
}

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  transaction,
  accounts,
  categories,
  currency = 'INR',
  onUpdate,
  onDelete,
  onCancel,
}) => {
  const { colors, typography, radii } = useTheme();

  const [type, setType] = useState<TransactionType>(transaction?.type || 'expense');
  const [amountStr, setAmountStr] = useState<string>(transaction ? transaction.amount.toString() : '');
  const [description, setDescription] = useState<string>(transaction?.description || '');
  const [notes, setNotes] = useState<string>(transaction?.notes || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(transaction?.category || 'Food & Dining');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(transaction?.accountId || accounts[0]?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmountStr(transaction.amount.toString());
      setDescription(transaction.description);
      setNotes(transaction.notes || '');
      setSelectedCategory(transaction.category);
      setSelectedAccountId(transaction.accountId);
    }
  }, [transaction]);

  if (!transaction) return null;

  const currencySymbol = getCurrencySymbol(currency);
  const availableCategories = categories.filter((c) => c.type === type);

  const handleUpdate = async () => {
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      setErrorMessage('Please enter a valid positive amount.');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('Please enter a description.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onUpdate({
        ...transaction,
        amount,
        description: description.trim(),
        type,
        category: selectedCategory,
        accountId: selectedAccountId,
        notes: notes.trim() || undefined,
        updatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update transaction.');
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(transaction.id);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete transaction.');
      setIsDeleting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <LedgerLabel style={styles.headerTitle}>EDIT TRANSACTION</LedgerLabel>
          <TouchableOpacity onPress={onCancel} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text variant="caption" color={colors.inkMuted}>
              CANCEL
            </Text>
          </TouchableOpacity>
        </View>

        {/* Segmented Type Selector */}
        <SegmentedControl<TransactionType>
          options={[
            { value: 'expense', label: 'EXPENSE' },
            { value: 'income', label: 'INCOME' },
            { value: 'transfer', label: 'TRANSFER' },
          ]}
          value={type}
          onChange={(newType) => {
            setType(newType);
            const firstCat = categories.find((c) => c.type === newType);
            if (firstCat) setSelectedCategory(firstCat.name);
          }}
          style={styles.typeSelector}
        />

        {/* Centered Large Amount Entry */}
        <View style={styles.amountSection}>
          <View style={styles.amountRow}>
            <Text variant="bold" size={32} color={colors.inkSubtle} style={styles.currencyPrefix}>
              {currencySymbol}
            </Text>
            <TextInput
              value={amountStr}
              onChangeText={(val) => setAmountStr(val.replace(/[^0-9.]/g, ''))}
              placeholder="0"
              placeholderTextColor={colors.inkSubtle}
              keyboardType="decimal-pad"
              style={[
                styles.amountInput,
                {
                  color: colors.ink,
                  fontFamily: typography.fonts.display,
                },
              ]}
            />
          </View>
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <LedgerLabel style={styles.inputLabel}>DESCRIPTION</LedgerLabel>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="e.g. Swiggy Lunch"
            placeholderTextColor={colors.inkSubtle}
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
        </View>

        {/* Category Horizontal Selector */}
        <View style={styles.inputGroup}>
          <LedgerLabel style={styles.inputLabel}>CATEGORY</LedgerLabel>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
          >
            {availableCategories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.name)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected ? colors.ink : colors.bone,
                      borderRadius: radii.sm,
                    },
                  ]}
                >
                  <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
                  <Text
                    variant={isSelected ? 'semibold' : 'body'}
                    size={13}
                    color={isSelected ? colors.paper : colors.ink}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Account Selector */}
        {accounts.length > 0 && (
          <View style={styles.inputGroup}>
            <LedgerLabel style={styles.inputLabel}>ACCOUNT</LedgerLabel>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsScroll}
            >
              {accounts.map((acc) => {
                const isSelected = selectedAccountId === acc.id;
                return (
                  <TouchableOpacity
                    key={acc.id}
                    onPress={() => setSelectedAccountId(acc.id)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? colors.ink : colors.bone,
                        borderRadius: radii.sm,
                      },
                    ]}
                  >
                    <Text
                      variant={isSelected ? 'semibold' : 'body'}
                      size={13}
                      color={isSelected ? colors.paper : colors.ink}
                    >
                      {acc.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Notes */}
        <View style={styles.inputGroup}>
          <LedgerLabel style={styles.inputLabel}>NOTES / TAGS</LedgerLabel>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Optional additional notes"
            placeholderTextColor={colors.inkSubtle}
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
        </View>

        {errorMessage && (
          <Text variant="caption" color={colors.terracotta} style={styles.errorText}>
            {errorMessage}
          </Text>
        )}

        {/* Save & Delete Action Row */}
        <View style={styles.actionsRow}>
          <Button
            title="DELETE"
            variant="danger"
            size="lg"
            loading={isDeleting}
            onPress={handleDelete}
            style={styles.deleteBtn}
          />
          <Button
            title="SAVE CHANGES"
            variant="primary"
            size="lg"
            loading={isSubmitting}
            onPress={handleUpdate}
            style={styles.updateBtn}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    width: '100%',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 11,
  },
  typeSelector: {
    marginBottom: 20,
  },
  amountSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyPrefix: {
    marginRight: 6,
  },
  amountInput: {
    fontSize: 44,
    minWidth: 100,
    textAlign: 'center',
    paddingVertical: 4,
  },
  inputGroup: {
    marginTop: 16,
  },
  inputLabel: {
    marginBottom: 8,
  },
  textInput: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  chipsScroll: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  errorText: {
    marginTop: 14,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  deleteBtn: {
    flex: 1,
  },
  updateBtn: {
    flex: 2,
  },
});

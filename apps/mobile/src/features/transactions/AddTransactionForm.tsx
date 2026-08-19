import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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

interface AddTransactionFormProps {
  accounts: Account[];
  categories: Category[];
  currency?: string;
  onSave: (tx: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  profileId: string;
}

const QUICK_AMOUNT_PRESETS = [100, 500, 1000, 2000, 5000];

export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({
  accounts,
  categories,
  currency = 'INR',
  onSave,
  onCancel,
  profileId,
}) => {
  const { colors, typography, radii } = useTheme();

  const [type, setType] = useState<TransactionType>('expense');
  const [amountStr, setAmountStr] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories.find((c) => c.type === 'expense')?.name || 'Food & Dining'
  );
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    accounts[0]?.id || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currencySymbol = getCurrencySymbol(currency);
  const availableCategories = categories.filter((c) => c.type === type);

  // Quick Amount preset increment handler
  const handleQuickAddAmount = (addVal: number) => {
    const current = parseFloat(amountStr) || 0;
    const next = current + addVal;
    setAmountStr(next.toString());
  };

  // Smart Category Auto-Detection as user types description
  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    const lower = text.toLowerCase().trim();

    if (type === 'expense') {
      if (
        lower.includes('swiggy') ||
        lower.includes('zomato') ||
        lower.includes('food') ||
        lower.includes('dinner') ||
        lower.includes('lunch') ||
        lower.includes('coffee') ||
        lower.includes('chai') ||
        lower.includes('starbucks') ||
        lower.includes('grocery') ||
        lower.includes('supermarket')
      ) {
        const cat = categories.find((c) => c.name.toLowerCase().includes('food'));
        if (cat) setSelectedCategory(cat.name);
      } else if (
        lower.includes('uber') ||
        lower.includes('ola') ||
        lower.includes('fuel') ||
        lower.includes('petrol') ||
        lower.includes('diesel') ||
        lower.includes('metro') ||
        lower.includes('auto') ||
        lower.includes('cab') ||
        lower.includes('flight')
      ) {
        const cat = categories.find((c) => c.name.toLowerCase().includes('transport'));
        if (cat) setSelectedCategory(cat.name);
      } else if (
        lower.includes('amazon') ||
        lower.includes('flipkart') ||
        lower.includes('myntra') ||
        lower.includes('cloth') ||
        lower.includes('mall') ||
        lower.includes('shopping')
      ) {
        const cat = categories.find((c) => c.name.toLowerCase().includes('shopping'));
        if (cat) setSelectedCategory(cat.name);
      } else if (
        lower.includes('wifi') ||
        lower.includes('internet') ||
        lower.includes('airtel') ||
        lower.includes('jio') ||
        lower.includes('electricity') ||
        lower.includes('rent') ||
        lower.includes('water') ||
        lower.includes('bill')
      ) {
        const cat = categories.find((c) => c.name.toLowerCase().includes('bill'));
        if (cat) setSelectedCategory(cat.name);
      } else if (
        lower.includes('movie') ||
        lower.includes('netflix') ||
        lower.includes('spotify') ||
        lower.includes('game') ||
        lower.includes('party')
      ) {
        const cat = categories.find((c) => c.name.toLowerCase().includes('entertainment'));
        if (cat) setSelectedCategory(cat.name);
      }
    } else if (type === 'income') {
      if (lower.includes('salary') || lower.includes('payroll') || lower.includes('bonus')) {
        const cat = categories.find((c) => c.name.toLowerCase().includes('salary'));
        if (cat) setSelectedCategory(cat.name);
      } else if (lower.includes('freelance') || lower.includes('client') || lower.includes('project')) {
        const cat = categories.find((c) => c.name.toLowerCase().includes('freelance'));
        if (cat) setSelectedCategory(cat.name);
      }
    }
  };

  const handleSubmit = async () => {
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      setErrorMessage('Please enter a valid positive amount.');
      return;
    }

    // Zero-friction defaulting: If description left blank, default to selected category name
    const finalDescription = description.trim() || selectedCategory;

    if (!selectedAccountId && accounts.length > 0) {
      setErrorMessage('Please select an account.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onSave({
        profileId,
        date: new Date().toISOString(),
        description: finalDescription,
        amount,
        currency,
        category: selectedCategory,
        type,
        accountId: selectedAccountId || accounts[0]?.id || 'default',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to record transaction.');
      setIsSubmitting(false);
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
          <LedgerLabel style={styles.headerTitle}>ADD TRANSACTION</LedgerLabel>
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
              onChangeText={(val) => {
                const cleaned = val.replace(/[^0-9.]/g, '');
                setAmountStr(cleaned);
              }}
              placeholder="0"
              placeholderTextColor={colors.inkSubtle}
              keyboardType="decimal-pad"
              autoFocus
              style={[
                styles.amountInput,
                {
                  color: colors.ink,
                  fontFamily: typography.fonts.display,
                },
              ]}
            />
          </View>

          {/* Quick Increment Preset Chips */}
          <View style={styles.presetsRow}>
            {QUICK_AMOUNT_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset}
                onPress={() => handleQuickAddAmount(preset)}
                style={[
                  styles.presetChip,
                  {
                    backgroundColor: colors.bone,
                    borderColor: colors.border,
                    borderRadius: radii.sm,
                  },
                ]}
              >
                <Text variant="semibold" size={11} color={colors.ink}>
                  +{currencySymbol}{preset >= 1000 ? `${preset / 1000}k` : preset}
                </Text>
              </TouchableOpacity>
            ))}
            {amountStr.length > 0 && (
              <TouchableOpacity
                onPress={() => setAmountStr('')}
                style={[
                  styles.presetChip,
                  {
                    backgroundColor: colors.bone,
                    borderColor: colors.border,
                    borderRadius: radii.sm,
                  },
                ]}
              >
                <Text variant="semibold" size={11} color={colors.terracotta}>
                  CLEAR
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Description ("What was this for?") with Smart Auto-Categorization */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <LedgerLabel style={styles.inputLabel}>WHAT WAS THIS FOR?</LedgerLabel>
            <Text variant="caption" color={colors.inkSubtle} size={11}>
              Auto-categorizes as you type
            </Text>
          </View>
          <TextInput
            value={description}
            onChangeText={handleDescriptionChange}
            placeholder={`Optional (defaults to ${selectedCategory})`}
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

        {/* Error Feedback */}
        {errorMessage && (
          <Text variant="caption" color={colors.terracotta} style={styles.errorText}>
            {errorMessage}
          </Text>
        )}

        {/* Save CTA - 1-Tap Log */}
        <Button
          title={amountStr ? `RECORD ${currencySymbol}${amountStr}` : 'RECORD TRANSACTION'}
          size="lg"
          loading={isSubmitting}
          onPress={handleSubmit}
          style={styles.saveButton}
        />
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
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 11,
  },
  typeSelector: {
    marginBottom: 16,
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
    fontSize: 48,
    minWidth: 100,
    textAlign: 'center',
    paddingVertical: 2,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
  },
  inputGroup: {
    marginTop: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    marginBottom: 0,
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
  saveButton: {
    marginTop: 22,
  },
});

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Text, LedgerLabel } from '../../components/Typography';
import { SegmentedControl } from '../../components/SegmentedControl';
import { Button } from '../../components/Button';
import { Category } from '@fintrack/domain';

interface AddCategoryModalProps {
  onSave: (cat: Omit<Category, 'id' | 'isCustom'>) => Promise<void>;
  onCancel: () => void;
}

const SEMANTIC_COLORS = [
  '#526B4F', // Moss
  '#687276', // Slate
  '#C96F52', // Terracotta
  '#59445E', // Plum
  '#B89A58', // Brass
  '#9C4146', // Deep Crimson
  '#8A5D3B', // Warm Ochre
  '#2E7D72', // Teal
  '#3E5C76', // Slate Blue
];

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ onSave, onCancel }) => {
  const { colors, typography, radii } = useTheme();

  const [name, setName] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [selectedColor, setSelectedColor] = useState('#526B4F');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = async () => {
    if (!name.trim()) {
      setErrorMessage('Please enter a category name.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onSave({
        name: name.trim(),
        icon: 'tag',
        color: selectedColor,
        type,
        subcategories: [],
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create category.');
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <LedgerLabel style={styles.headerTitle}>CREATE CUSTOM CATEGORY</LedgerLabel>
        <TouchableOpacity onPress={onCancel} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text variant="caption" color={colors.inkMuted}>
            CANCEL
          </Text>
        </TouchableOpacity>
      </View>

      <SegmentedControl<'expense' | 'income'>
        options={[
          { value: 'expense', label: 'EXPENSE' },
          { value: 'income', label: 'INCOME' },
        ]}
        value={type}
        onChange={setType}
        style={styles.segmented}
      />

      <View style={styles.inputGroup}>
        <LedgerLabel style={styles.inputLabel}>CATEGORY NAME</LedgerLabel>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Pet Care, Subscriptions, Side Gig"
          placeholderTextColor={colors.inkSubtle}
          autoFocus
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

      <View style={styles.inputGroup}>
        <LedgerLabel style={styles.inputLabel}>SEMANTIC COLOR ACCENT</LedgerLabel>
        <View style={styles.colorsGrid}>
          {SEMANTIC_COLORS.map((c) => {
            const isSelected = selectedColor === c;
            return (
              <TouchableOpacity
                key={c}
                onPress={() => setSelectedColor(c)}
                style={[
                  styles.colorCircle,
                  { backgroundColor: c },
                  isSelected && { borderColor: colors.ink, borderWidth: 3 },
                ]}
              />
            );
          })}
        </View>
      </View>

      {errorMessage && (
        <Text variant="caption" color={colors.terracotta} style={styles.errorText}>
          {errorMessage}
        </Text>
      )}

      <Button
        title="ADD CATEGORY"
        size="lg"
        loading={isSubmitting}
        onPress={handleSave}
        style={styles.saveBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 11,
  },
  segmented: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    marginBottom: 8,
  },
  textInput: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  errorText: {
    marginBottom: 12,
    textAlign: 'center',
  },
  saveBtn: {
    marginTop: 12,
  },
});

import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Text } from '../../components/Typography';
import { Category, TransactionType } from '@fintrack/domain';

export type TypeFilterOption = 'all' | TransactionType;

interface TransactionFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedType: TypeFilterOption;
  onTypeChange: (t: TypeFilterOption) => void;
  selectedCategory: string | null;
  onCategoryChange: (cat: string | null) => void;
  categories: Category[];
}

export const TransactionFilterBar: React.FC<TransactionFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedCategory,
  onCategoryChange,
  categories,
}) => {
  const { colors, typography, radii } = useTheme();

  return (
    <View style={styles.container}>
      {/* Search Input Box */}
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: colors.surfaceInput,
            borderRadius: radii.sm,
            borderColor: colors.border,
          },
        ]}
      >
        <TextInput
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search by merchant, note, or item..."
          placeholderTextColor={colors.inkSubtle}
          style={[
            styles.searchInput,
            {
              color: colors.ink,
              fontFamily: typography.fonts.sans,
            },
          ]}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => onSearchChange('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text variant="caption" color={colors.inkMuted}>
              CLEAR
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {/* Type Options */}
        {(['all', 'expense', 'income', 'transfer'] as TypeFilterOption[]).map((t) => {
          const isSelected = selectedType === t;
          return (
            <TouchableOpacity
              key={t}
              onPress={() => onTypeChange(t)}
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
                size={12}
                color={isSelected ? colors.paper : colors.ink}
              >
                {t.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}

        <View style={[styles.separator, { backgroundColor: colors.border }]} />

        {/* Category Reset */}
        {selectedCategory && (
          <TouchableOpacity
            onPress={() => onCategoryChange(null)}
            style={[
              styles.chip,
              {
                backgroundColor: colors.terracotta,
                borderRadius: radii.sm,
              },
            ]}
          >
            <Text variant="semibold" size={12} color="#FFFFFF">
              ✕ {selectedCategory}
            </Text>
          </TouchableOpacity>
        )}

        {/* Categories */}
        {categories.map((c) => {
          const isSelected = selectedCategory === c.name;
          return (
            <TouchableOpacity
              key={c.id}
              onPress={() => onCategoryChange(isSelected ? null : c.name)}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? colors.ink : colors.bone,
                  borderRadius: radii.sm,
                },
              ]}
            >
              <View style={[styles.categoryDot, { backgroundColor: c.color }]} />
              <Text
                variant={isSelected ? 'semibold' : 'body'}
                size={12}
                color={isSelected ? colors.paper : colors.ink}
              >
                {c.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  filterScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  separator: {
    width: 1,
    height: 18,
    marginHorizontal: 8,
  },
});

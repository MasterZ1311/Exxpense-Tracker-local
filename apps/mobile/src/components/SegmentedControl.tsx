import { View, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Text } from './Typography';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  style,
}: SegmentedControlProps<T>) {
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            style={styles.optionButton}
            activeOpacity={0.7}
          >
            <Text
              variant={isSelected ? 'semibold' : 'secondary'}
              size={13}
              color={isSelected ? colors.ink : colors.inkMuted}
              style={[
                styles.optionLabel,
                {
                  letterSpacing: typography.tracking.wide,
                  textTransform: 'uppercase',
                },
              ]}
            >
              {option.label}
            </Text>
            {isSelected ? (
              <View
                style={[
                  styles.activeIndicator,
                  { backgroundColor: colors.chartreuse },
                ]}
              />
            ) : (
              <View
                style={[
                  styles.inactiveIndicator,
                  { backgroundColor: 'transparent' },
                ]}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD8CB',
  },
  optionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionLabel: {
    marginBottom: 6,
  },
  activeIndicator: {
    height: 3,
    width: '100%',
    borderRadius: 1.5,
  },
  inactiveIndicator: {
    height: 3,
    width: '100%',
  },
});

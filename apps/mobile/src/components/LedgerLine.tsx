import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface LedgerLineProps {
  style?: StyleProp<ViewStyle>;
  dashed?: boolean;
  opacity?: number;
}

export const LedgerLine: React.FC<LedgerLineProps> = ({ style, opacity = 1 }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        {
          height: StyleSheet.hairlineWidth || 1,
          backgroundColor: colors.ledgerLine,
          width: '100%',
          opacity,
        },
        style,
      ]}
    />
  );
};

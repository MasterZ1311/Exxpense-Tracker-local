import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Text } from './Typography';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  style,
  disabled,
  ...props
}) => {
  const { colors, radii, spacing } = useTheme();

  let backgroundColor = colors.chartreuse;
  let textColor = colors.chartreuseText;
  let borderColor: string | undefined = undefined;
  let borderWidth = 0;

  if (variant === 'secondary') {
    backgroundColor = colors.surfaceElevated;
    textColor = colors.ink;
  } else if (variant === 'outline') {
    backgroundColor = 'transparent';
    textColor = colors.ink;
    borderColor = colors.border;
    borderWidth = 1;
  } else if (variant === 'danger') {
    backgroundColor = colors.terracotta;
    textColor = '#FFFFFF';
  } else if (variant === 'ghost') {
    backgroundColor = 'transparent';
    textColor = colors.ink;
  }

  let paddingVertical = spacing.sm;
  let paddingHorizontal = spacing.md;
  let fontSize = 15;

  if (size === 'sm') {
    paddingVertical = spacing.xs;
    paddingHorizontal = spacing.sm;
    fontSize = 13;
  } else if (size === 'lg') {
    paddingVertical = spacing.md;
    paddingHorizontal = spacing.lg;
    fontSize = 16;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      disabled={disabled || loading}
      style={[
        {
          backgroundColor: disabled ? colors.bone : backgroundColor,
          borderRadius: radii.button,
          paddingVertical,
          paddingHorizontal,
          borderColor,
          borderWidth,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon ? <View style={styles.leftIconContainer}>{leftIcon}</View> : null}
          <Text
            variant="semibold"
            size={fontSize}
            color={disabled ? colors.inkSubtle : textColor}
          >
            {title}
          </Text>
          {rightIcon ? <View style={styles.rightIconContainer}>{rightIcon}</View> : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIconContainer: {
    marginRight: 8,
  },
  rightIconContainer: {
    marginLeft: 8,
  },
});

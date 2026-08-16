import React from 'react';
import { Text as RNText, TextProps, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface CustomTextProps extends TextProps {
  color?: string;
  style?: TextStyle | TextStyle[];
}

export const DisplayNumber: React.FC<
  CustomTextProps & { size?: number; serif?: boolean }
> = ({ children, color, style, size, serif = true, ...props }) => {
  const { colors, typography } = useTheme();

  return (
    <RNText
      style={[
        {
          fontFamily: serif ? typography.fonts.display : typography.fonts.sansSemiBold,
          fontSize: size || typography.sizes.heroBalance,
          color: color || colors.ink,
          letterSpacing: typography.tracking.tight,
          fontVariant: ['tabular-nums'],
          includeFontPadding: false,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

export const EditorialHeadline: React.FC<CustomTextProps & { size?: number }> = ({
  children,
  color,
  style,
  size,
  ...props
}) => {
  const { colors, typography } = useTheme();

  return (
    <RNText
      style={[
        {
          fontFamily: typography.fonts.display,
          fontSize: size || typography.sizes.h1,
          color: color || colors.ink,
          letterSpacing: typography.tracking.tight,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

export const Text: React.FC<
  CustomTextProps & {
    variant?: 'body' | 'caption' | 'secondary' | 'medium' | 'semibold' | 'bold';
    size?: number;
  }
> = ({ children, color, style, variant = 'body', size, ...props }) => {
  const { colors, typography } = useTheme();

  let fontFamily = typography.fonts.sans;
  let textColor = color || colors.ink;
  let fontSize = size || typography.sizes.body;

  if (variant === 'secondary') {
    textColor = color || colors.inkMuted;
  } else if (variant === 'caption') {
    fontSize = size || typography.sizes.caption;
    textColor = color || colors.inkSubtle;
  } else if (variant === 'medium') {
    fontFamily = typography.fonts.sansMedium;
  } else if (variant === 'semibold') {
    fontFamily = typography.fonts.sansSemiBold;
  } else if (variant === 'bold') {
    fontFamily = typography.fonts.sansBold;
  }

  return (
    <RNText
      style={[
        {
          fontFamily,
          fontSize,
          color: textColor,
          letterSpacing: typography.tracking.normal,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

export const LedgerLabel: React.FC<CustomTextProps> = ({ children, color, style, ...props }) => {
  const { colors, typography } = useTheme();

  return (
    <RNText
      style={[
        {
          fontFamily: typography.fonts.sansSemiBold,
          fontSize: typography.sizes.badge,
          color: color || colors.inkSubtle,
          letterSpacing: typography.tracking.widest,
          textTransform: 'uppercase',
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

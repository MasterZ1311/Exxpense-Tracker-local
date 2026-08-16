import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Text, LedgerLabel, EditorialHeadline } from '../../components/Typography';
import { FinancialPulseResult } from '@fintrack/domain';

interface FinancialPulseProps {
  pulse: FinancialPulseResult;
}

export const FinancialPulse: React.FC<FinancialPulseProps> = ({ pulse }) => {
  const { colors, radii, spacing } = useTheme();

  // Generate 20 segmented pulse blocks
  const totalBlocks = 20;
  const activeBlocks = Math.round((pulse.score / 100) * totalBlocks);

  let statusColor = colors.moss;
  if (pulse.status === 'THRIVING') statusColor = colors.chartreuse;
  else if (pulse.status === 'MODERATE') statusColor = colors.brass;
  else if (pulse.status === 'CAUTION' || pulse.status === 'CRITICAL') statusColor = colors.terracotta;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <LedgerLabel>FINANCIAL PULSE</LedgerLabel>
        <Text variant="semibold" size={13} color={colors.ink}>
          {pulse.headline}
        </Text>
      </View>

      {/* Horizontal Segmented Pulse Track */}
      <View style={styles.pulseTrack}>
        {Array.from({ length: totalBlocks }).map((_, index) => {
          const isActive = index < activeBlocks;
          return (
            <View
              key={index}
              style={[
                styles.pulseSegment,
                {
                  backgroundColor: isActive ? statusColor : colors.bone,
                  opacity: isActive ? (index > activeBlocks - 3 ? 0.75 : 1) : 0.4,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Insight Editorial Narrative */}
      <Text variant="secondary" size={14} style={styles.insightText}>
        {pulse.insight}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pulseTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 8,
    marginVertical: 8,
  },
  pulseSegment: {
    flex: 1,
    height: 8,
    marginHorizontal: 1.5,
    borderRadius: 2,
  },
  insightText: {
    marginTop: 10,
    lineHeight: 20,
  },
});

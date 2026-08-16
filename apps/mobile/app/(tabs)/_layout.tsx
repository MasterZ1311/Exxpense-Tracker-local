import React from 'react';
import { Tabs } from 'expo-router';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeContext';
import { Text } from '../../src/components/Typography';

function CustomTabBar({ state, descriptors, navigation }: any) {
  const { colors, radii, typography } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          backgroundColor: colors.surfaceElevated,
          borderTopColor: colors.border,
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            {isFocused && (
              <View
                style={[
                  styles.activeDot,
                  { backgroundColor: colors.chartreuse },
                ]}
              />
            )}
            <Text
              variant={isFocused ? 'semibold' : 'secondary'}
              size={11}
              color={isFocused ? colors.ink : colors.inkMuted}
              style={[
                styles.tabLabel,
                {
                  letterSpacing: typography.tracking.wide,
                  textTransform: 'uppercase',
                },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'HOME',
        }}
      />
      <Tabs.Screen
        name="money"
        options={{
          title: 'MONEY',
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: 'PLAN',
        }}
      />
      <Tabs.Screen
        name="analyze"
        options={{
          title: 'ANALYZE',
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'MORE',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: StyleSheet.hairlineWidth || 1,
    paddingTop: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 4,
  },
  activeDot: {
    width: 14,
    height: 3,
    borderRadius: 1.5,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 10,
  },
});

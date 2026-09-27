import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { radius, spacing, typography } from "../theme/colors";

interface RatingBadgeProps {
  rating: number;
  size?: "small" | "large";
}

function ratingColor(rating: number, colors: ReturnType<typeof useTheme>["colors"]): string {
  if (rating >= 85) return colors.success;
  if (rating >= 65) return colors.primary;
  if (rating >= 45) return colors.accent;
  return colors.danger;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({ rating, size = "small" }) => {
  const { colors } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    animatedValue.setValue(0);
    const listener = animatedValue.addListener(({ value }) => {
      setDisplayValue(Math.round(value));
    });
    Animated.timing(animatedValue, {
      toValue: rating,
      duration: 700,
      useNativeDriver: false
    }).start();
    return () => animatedValue.removeListener(listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rating]);

  const color = ratingColor(rating, colors);
  const isLarge = size === "large";

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color + "22",
          borderColor: color,
          paddingVertical: isLarge ? spacing.sm : 4,
          paddingHorizontal: isLarge ? spacing.md : spacing.sm
        }
      ]}
    >
      <Text style={[isLarge ? typography.h3 : typography.bodyBold, { color }]}>
        {displayValue}
        <Text style={[typography.caption, { color }]}>/100</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.pill,
    borderWidth: 1.5,
    alignSelf: "flex-start"
  }
});

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { radius, spacing, typography } from "../theme/colors";
import { SortOption } from "../types";

interface SortControlProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const OPTIONS: { key: SortOption; label: string }[] = [
  { key: "rating", label: "Highest Rating" },
  { key: "votes", label: "Most Votes" },
  { key: "newest", label: "Newest" }
];

export const SortControl: React.FC<SortControlProps> = ({ value, onChange }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
      {OPTIONS.map((opt) => {
        const active = opt.key === value;
        return (
          <TouchableOpacity
            key={opt.key}
            style={[styles.pill, active && { backgroundColor: colors.primary }]}
            onPress={() => onChange(opt.key)}
            activeOpacity={0.8}
          >
            <Text
              style={[typography.caption, { color: active ? "#FFFFFF" : colors.textMuted }]}
              numberOfLines={1}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: radius.pill,
    borderWidth: 1,
    padding: 4,
    gap: 4
  },
  pill: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    alignItems: "center"
  }
});

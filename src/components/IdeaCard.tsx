import React, { useEffect, useRef, useState } from "react";
import { Animated, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext";
import { radius, spacing, typography } from "../theme/colors";
import { Idea } from "../types";
import { RatingBadge } from "./RatingBadge";

interface IdeaCardProps {
  idea: Idea;
  hasVoted: boolean;
  onUpvote: (id: string) => void;
  index?: number;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea, hasVoted, onUpvote, index = 0 }) => {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const entrance = useRef(new Animated.Value(0)).current;
  const voteScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 420,
      delay: Math.min(index, 8) * 60,
      useNativeDriver: true
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpvote = () => {
    if (hasVoted) return;
    Animated.sequence([
      Animated.timing(voteScale, { toValue: 1.25, duration: 120, useNativeDriver: true }),
      Animated.spring(voteScale, { toValue: 1, friction: 3, useNativeDriver: true })
    ]).start();
    onUpvote(idea.id);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🚀 ${idea.name}\n"${idea.tagline}"\n\nAI Score: ${idea.rating}/100\n\n${idea.description}`
      });
    } catch (e) {
      // sharing cancelled or failed silently
    }
  };

  const descriptionPreview =
    idea.description.length > 110 && !expanded ? `${idea.description.slice(0, 110).trim()}…` : idea.description;

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadow,
          opacity: entrance,
          transform: [
            {
              translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [16, 0] })
            }
          ]
        }
      ]}
    >
      <View style={styles.headerRow}>
        <View style={{ flex: 1, paddingRight: spacing.sm }}>
          <Text style={[typography.h3, { color: colors.text }]} numberOfLines={1}>
            {idea.name}
          </Text>
          <Text style={[typography.caption, { color: colors.textMuted, marginTop: 2 }]} numberOfLines={1}>
            {idea.tagline}
          </Text>
        </View>
        <RatingBadge rating={idea.rating} />
      </View>

      <View style={[styles.insightRow, { backgroundColor: colors.surfaceAlt }]}>
        <Ionicons name="sparkles" size={14} color={colors.primary} />
        <Text style={[typography.small, { color: colors.textMuted, marginLeft: spacing.xs, flex: 1 }]} numberOfLines={2}>
          {idea.insight}
        </Text>
      </View>

      <Text style={[typography.body, { color: colors.text, marginTop: spacing.sm }]}>
        {descriptionPreview}
      </Text>

      {idea.description.length > 110 && (
        <TouchableOpacity onPress={() => setExpanded((e) => !e)} style={{ marginTop: spacing.xs }}>
          <Text style={[typography.caption, { color: colors.primary }]}>
            {expanded ? "Read less" : "Read more"}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.footerRow}>
        <View style={styles.votesWrap}>
          <Ionicons name="heart" size={16} color={colors.danger} />
          <Text style={[typography.caption, { color: colors.textMuted, marginLeft: 4 }]}>
            {idea.votes} {idea.votes === 1 ? "vote" : "votes"}
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={handleShare} style={[styles.iconButton, { borderColor: colors.border }]}>
            <Ionicons name="share-outline" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <Animated.View style={{ transform: [{ scale: voteScale }] }}>
            <TouchableOpacity
              onPress={handleUpvote}
              disabled={hasVoted}
              style={[
                styles.voteButton,
                {
                  backgroundColor: hasVoted ? colors.surfaceAlt : colors.primary,
                  borderColor: hasVoted ? colors.border : colors.primary
                }
              ]}
            >
              <Ionicons
                name={hasVoted ? "checkmark" : "arrow-up"}
                size={16}
                color={hasVoted ? colors.textMuted : "#FFFFFF"}
              />
              <Text
                style={[
                  typography.caption,
                  { color: hasVoted ? colors.textMuted : "#FFFFFF", marginLeft: 4 }
                ]}
              >
                {hasVoted ? "Voted" : "Upvote"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between"
  },
  insightRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginTop: spacing.sm
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md
  },
  votesWrap: {
    flexDirection: "row",
    alignItems: "center"
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  voteButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1.5
  }
});

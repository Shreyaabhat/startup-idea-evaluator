import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../src/theme/ThemeContext";
import { useIdeas } from "../../src/context/IdeasContext";
import { EmptyState } from "../../src/components/EmptyState";
import { radius, spacing, typography } from "../../src/theme/colors";
import { Idea } from "../../src/types";

type LeaderboardMode = "votes" | "rating";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardScreen() {
  const { colors } = useTheme();
  const { ideas } = useIdeas();
  const [mode, setMode] = useState<LeaderboardMode>("votes");

  const topIdeas = useMemo(() => {
    const copy = [...ideas];
    copy.sort((a, b) => (mode === "votes" ? b.votes - a.votes : b.rating - a.rating));
    return copy.slice(0, 5);
  }, [ideas, mode]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[typography.h1, { color: colors.text }]}>Leaderboard 🏆</Text>
        <Text style={[typography.body, { color: colors.textMuted, marginTop: 2, marginBottom: spacing.md }]}>
          Top 5 startup ideas
        </Text>

        <View style={[styles.modeToggle, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
          {(["votes", "rating"] as LeaderboardMode[]).map((m) => {
            const active = m === mode;
            return (
              <TouchableOpacity
                key={m}
                onPress={() => setMode(m)}
                style={[styles.modeButton, active && { backgroundColor: colors.primary }]}
              >
                <Text style={[typography.caption, { color: active ? "#FFFFFF" : colors.textMuted }]}>
                  {m === "votes" ? "Most Votes" : "Highest AI Rating"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {topIdeas.length === 0 ? (
        <EmptyState
          icon="trophy-outline"
          title="No rankings yet"
          subtitle="Submit and vote on ideas to populate the leaderboard."
        />
      ) : (
        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {topIdeas.map((idea, index) => (
            <LeaderboardRow key={idea.id} idea={idea} rank={index + 1} mode={mode} index={index} />
          ))}
          {ideas.length < 5 && (
            <Text style={[typography.caption, { color: colors.textMuted, textAlign: "center", marginTop: spacing.md }]}>
              Only {ideas.length} {ideas.length === 1 ? "idea has" : "ideas have"} been submitted so far — submit more to fill the board!
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

interface LeaderboardRowProps {
  idea: Idea;
  rank: number;
  mode: LeaderboardMode;
  index: number;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ idea, rank, mode, index }) => {
  const { colors } = useTheme();
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(entrance, {
      toValue: 1,
      friction: 7,
      tension: 60,
      delay: index * 90,
      useNativeDriver: true
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gradient =
    rank === 1 ? colors.gradientGold : rank === 2 ? colors.gradientSilver : rank === 3 ? colors.gradientBronze : null;

  const metricValue = mode === "votes" ? idea.votes : idea.rating;
  const metricLabel = mode === "votes" ? (idea.votes === 1 ? "vote" : "votes") : "score";

  const content = (
    <View style={styles.rowContent}>
      <View style={styles.rankWrap}>
        {rank <= 3 ? (
          <Text style={styles.medal}>{MEDALS[rank - 1]}</Text>
        ) : (
          <Text style={[typography.h2, { color: rank <= 3 ? "#FFFFFF" : colors.textMuted }]}>#{rank}</Text>
        )}
      </View>
      <View style={{ flex: 1, marginHorizontal: spacing.sm }}>
        <Text
          style={[typography.h3, { color: gradient ? "#2A1D00" : colors.text }]}
          numberOfLines={1}
        >
          {idea.name}
        </Text>
        <Text
          style={[typography.caption, { color: gradient ? "#3A2D10CC" : colors.textMuted }]}
          numberOfLines={1}
        >
          {idea.tagline}
        </Text>
      </View>
      <View style={styles.metricWrap}>
        <Text style={[typography.h2, { color: gradient ? "#2A1D00" : colors.primary }]}>{metricValue}</Text>
        <Text style={[typography.small, { color: gradient ? "#3A2D10CC" : colors.textMuted }]}>{metricLabel}</Text>
      </View>
    </View>
  );

  return (
    <Animated.View
      style={{
        opacity: entrance,
        transform: [
          { scale: entrance.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
          { translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }
        ],
        marginBottom: spacing.md
      }}
    >
      {gradient ? (
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, styles.cardShadow, { shadowColor: colors.shadow }]}
        >
          {content}
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.card,
            styles.cardShadow,
            { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, shadowColor: colors.shadow }
          ]}
        >
          {content}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  listContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xxl },
  modeToggle: {
    flexDirection: "row",
    borderRadius: radius.pill,
    borderWidth: 1,
    padding: 4,
    gap: 4
  },
  modeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    alignItems: "center"
  },
  card: {
    borderRadius: radius.lg,
    padding: spacing.md
  },
  cardShadow: {
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center"
  },
  rankWrap: {
    width: 48,
    alignItems: "center",
    justifyContent: "center"
  },
  medal: {
    fontSize: 32
  },
  metricWrap: {
    alignItems: "center",
    minWidth: 56
  }
});

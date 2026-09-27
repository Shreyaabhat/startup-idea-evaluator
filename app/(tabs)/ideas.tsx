import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../src/theme/ThemeContext";
import { useIdeas } from "../../src/context/IdeasContext";
import { useToast } from "../../src/components/Toast";
import { IdeaCard } from "../../src/components/IdeaCard";
import { SortControl } from "../../src/components/SortControl";
import { EmptyState } from "../../src/components/EmptyState";
import { spacing, typography } from "../../src/theme/colors";
import { SortOption } from "../../src/types";

export default function IdeasScreen() {
  const { colors } = useTheme();
  const { ideas, upvoteIdea, hasVoted } = useIdeas();
  const { showToast } = useToast();
  const [sort, setSort] = useState<SortOption>("newest");

  const sortedIdeas = useMemo(() => {
    const copy = [...ideas];
    switch (sort) {
      case "rating":
        return copy.sort((a, b) => b.rating - a.rating);
      case "votes":
        return copy.sort((a, b) => b.votes - a.votes);
      case "newest":
      default:
        return copy.sort((a, b) => b.createdAt - a.createdAt);
    }
  }, [ideas, sort]);

  const handleUpvote = async (id: string) => {
    const result = await upvoteIdea(id);
    if (result.success) {
      showToast("❤️ Upvoted!");
    } else if (result.alreadyVoted) {
      showToast("You already voted on this idea");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[typography.h1, { color: colors.text }]}>Ideas 💡</Text>
        <Text style={[typography.body, { color: colors.textMuted, marginTop: 2, marginBottom: spacing.md }]}>
          {ideas.length} {ideas.length === 1 ? "idea" : "ideas"} submitted so far
        </Text>
        {ideas.length > 0 && <SortControl value={sort} onChange={setSort} />}
      </View>

      <FlatList
        data={sortedIdeas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <IdeaCard idea={item} hasVoted={hasVoted(item.id)} onUpvote={handleUpvote} index={index} />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="bulb-outline"
            title="No ideas yet"
            subtitle="Be the first to submit a startup idea and see your AI score."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  listContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xxl }
});

import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/theme/ThemeContext";
import { useIdeas } from "../../src/context/IdeasContext";
import { useToast } from "../../src/components/Toast";
import { PrimaryButton } from "../../src/components/PrimaryButton";
import { radius, spacing, typography } from "../../src/theme/colors";

const NAME_LIMIT = 40;
const TAGLINE_LIMIT = 80;
const DESCRIPTION_LIMIT = 400;

interface Errors {
  name?: string;
  tagline?: string;
  description?: string;
}

export default function SubmitScreen() {
  const { colors, mode, toggleTheme } = useTheme();
  const { addIdea } = useIdeas();
  const { showToast } = useToast();
  const router = useRouter();

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const nextErrors: Errors = {};
    if (!name.trim()) nextErrors.name = "Give your startup a name.";
    else if (name.trim().length < 2) nextErrors.name = "That name looks a little short.";

    if (!tagline.trim()) nextErrors.tagline = "A short tagline helps others get it fast.";

    if (!description.trim()) nextErrors.description = "Tell us what the idea actually does.";
    else if (description.trim().length < 20)
      nextErrors.description = "Add a bit more detail (at least 20 characters).";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Small artificial delay so the "AI thinking" moment feels real.
      await new Promise((resolve) => setTimeout(resolve, 650));
      await addIdea({ name, tagline, description });
      showToast("🚀 Idea submitted!");
      setName("");
      setTagline("");
      setDescription("");
      setErrors({});
      router.push("/ideas");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[typography.h1, { color: colors.text }]}>Startup Idea{"\n"}Evaluator 🚀</Text>
            <Text style={[typography.body, { color: colors.textMuted, marginTop: spacing.xs }]}>
              Pitch your idea and get an instant AI-style score.
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.themeToggle, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
          >
            <Ionicons name={mode === "dark" ? "sunny" : "moon"} size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Field
            label="Startup Name"
            placeholder="e.g. Nimbus"
            value={name}
            onChangeText={setName}
            limit={NAME_LIMIT}
            error={errors.name}
          />

          <Field
            label="Tagline"
            placeholder="e.g. Weather intelligence for small farms"
            value={tagline}
            onChangeText={setTagline}
            limit={TAGLINE_LIMIT}
            error={errors.tagline}
          />

          <Field
            label="Description"
            placeholder="What problem does it solve, and for whom?"
            value={description}
            onChangeText={setDescription}
            limit={DESCRIPTION_LIMIT}
            error={errors.description}
            multiline
          />

          <PrimaryButton
            label={submitting ? "Evaluating…" : "Get My AI Score"}
            onPress={handleSubmit}
            loading={submitting}
            style={{ marginTop: spacing.md }}
          />
        </View>

        <View style={[styles.hintCard, { backgroundColor: colors.surfaceAlt }]}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
          <Text style={[typography.small, { color: colors.textMuted, marginLeft: spacing.xs, flex: 1 }]}>
            Scores are generated locally for fun — no real AI is called.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface FieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  limit: number;
  error?: string;
  multiline?: boolean;
}

const Field: React.FC<FieldProps> = ({ label, placeholder, value, onChangeText, limit, error, multiline }) => {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: spacing.md }}>
      <View style={styles.labelRow}>
        <Text style={[typography.bodyBold, { color: colors.text }]}>{label}</Text>
        <Text style={[typography.small, { color: colors.textMuted }]}>
          {value.length}/{limit}
        </Text>
      </View>
      <TextInput
        value={value}
        onChangeText={(t) => onChangeText(t.slice(0, limit))}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        style={[
          styles.input,
          {
            backgroundColor: colors.surfaceAlt,
            borderColor: error ? colors.danger : colors.border,
            color: colors.text,
            minHeight: multiline ? 100 : 48,
            textAlignVertical: multiline ? "top" : "center"
          }
        ]}
      />
      {error && <Text style={[typography.small, { color: colors.danger, marginTop: 4 }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.lg,
    marginTop: spacing.sm
  },
  themeToggle: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.sm
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xs
  },
  input: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15
  },
  hintCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg
  }
});

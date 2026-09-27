import { NewIdeaInput } from "../types";

/**
 * Simple, fast string hash (djb2 variant). Deterministic for identical
 * input text, so the same idea text tends to land in the same score
 * neighbourhood, while still feeling different idea-to-idea.
 */
function hashString(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return Math.abs(hash);
}

const INSIGHTS_BY_TIER: Record<"low" | "mid" | "high" | "top", string[]> = {
  low: [
    "Needs clearer differentiation",
    "Market fit is still unproven",
    "Consider narrowing the target audience",
    "The core value proposition needs sharpening"
  ],
  mid: [
    "Promising idea with strong potential",
    "Solid foundation, worth iterating on",
    "Interesting market opportunity",
    "Could use a sharper go-to-market angle"
  ],
  high: [
    "Strong problem-solution fit",
    "Well-positioned for early traction",
    "Compelling value proposition",
    "Clear audience with real demand signals"
  ],
  top: [
    "Exceptional problem-solution fit",
    "Investor-ready with a sharp narrative",
    "Rare combination of timing and execution clarity",
    "Category-defining potential"
  ]
};

function pickFromTier(tier: "low" | "mid" | "high" | "top", seed: number): string {
  const options = INSIGHTS_BY_TIER[tier];
  return options[seed % options.length];
}

/**
 * Produces a fake "AI" rating between 0 and 100 for a submitted idea.
 *
 * The score is NOT purely random: it's derived from a deterministic base
 * (built from the combined length and character makeup of the idea's text)
 * plus a small bounded amount of randomness, so resubmitting near-identical
 * text tends to land in a similar range while still feeling alive.
 */
export function generateFakeScore(input: NewIdeaInput): { rating: number; insight: string } {
  const combinedText = `${input.name}|${input.tagline}|${input.description}`.trim();
  const hash = hashString(combinedText);

  // Deterministic base score derived from text length and hash, mapped to 35-90.
  const lengthSignal = Math.min(combinedText.length, 240) / 240; // 0..1
  const hashSignal = (hash % 100) / 100; // 0..1
  const base = 35 + Math.round((lengthSignal * 0.5 + hashSignal * 0.5) * 55); // 35..90

  // Bounded randomness so it still feels fun and non-static (+/- 8).
  const noise = Math.round((Math.random() - 0.5) * 16);

  const rating = Math.max(0, Math.min(100, base + noise));

  let tier: "low" | "mid" | "high" | "top";
  if (rating < 45) tier = "low";
  else if (rating < 65) tier = "mid";
  else if (rating < 85) tier = "high";
  else tier = "top";

  const insight = pickFromTier(tier, hash);

  return { rating, insight };
}

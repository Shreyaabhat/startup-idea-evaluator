export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryDark: string;
  accent: string;
  success: string;
  danger: string;
  gold: string;
  silver: string;
  bronze: string;
  shadow: string;
  gradientPrimary: [string, string];
  gradientGold: [string, string];
  gradientSilver: [string, string];
  gradientBronze: [string, string];
}

export const lightColors: ThemeColors = {
  background: "#F5F6FB",
  surface: "#FFFFFF",
  surfaceAlt: "#F0F1F9",
  border: "#E7E8F3",
  text: "#1B1B2F",
  textMuted: "#6B6B85",
  primary: "#6C5CE7",
  primaryDark: "#4834D4",
  accent: "#00CEC9",
  success: "#00B894",
  danger: "#E17055",
  gold: "#F5B301",
  silver: "#A0A5B8",
  bronze: "#C67F3C",
  shadow: "#2B2A5C",
  gradientPrimary: ["#6C5CE7", "#00CEC9"],
  gradientGold: ["#F6D365", "#FDA085"],
  gradientSilver: ["#E0E4F0", "#B8BDD1"],
  gradientBronze: ["#E8A87C", "#C67F3C"]
};

export const darkColors: ThemeColors = {
  background: "#0F0F1A",
  surface: "#1A1A2E",
  surfaceAlt: "#20203A",
  border: "#2C2C46",
  text: "#F2F2FA",
  textMuted: "#9494B0",
  primary: "#8C7CFF",
  primaryDark: "#6C5CE7",
  accent: "#2DE1DB",
  success: "#2ECC96",
  danger: "#FF8266",
  gold: "#FFC94D",
  silver: "#C5C9DB",
  bronze: "#E0996A",
  shadow: "#000000",
  gradientPrimary: ["#4834D4", "#00CEC9"],
  gradientGold: ["#F6A93B", "#E27B45"],
  gradientSilver: ["#8A8FA8", "#5D6280"],
  gradientBronze: ["#C67F3C", "#8A4F23"]
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999
};

export const typography = {
  h1: { fontSize: 28, fontWeight: "800" as const },
  h2: { fontSize: 22, fontWeight: "700" as const },
  h3: { fontSize: 18, fontWeight: "700" as const },
  body: { fontSize: 15, fontWeight: "400" as const },
  bodyBold: { fontSize: 15, fontWeight: "600" as const },
  caption: { fontSize: 13, fontWeight: "500" as const },
  small: { fontSize: 11, fontWeight: "500" as const }
};

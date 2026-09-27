import AsyncStorage from "@react-native-async-storage/async-storage";
import { Idea } from "../types";

const IDEAS_KEY = "@startup_evaluator/ideas";
const VOTED_IDS_KEY = "@startup_evaluator/voted_ids";

export async function loadIdeas(): Promise<Idea[]> {
  try {
    const raw = await AsyncStorage.getItem(IDEAS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Idea[];
  } catch (e) {
    console.warn("Failed to load ideas from storage", e);
    return [];
  }
}

export async function persistIdeas(ideas: Idea[]): Promise<void> {
  try {
    await AsyncStorage.setItem(IDEAS_KEY, JSON.stringify(ideas));
  } catch (e) {
    console.warn("Failed to persist ideas to storage", e);
  }
}

export async function loadVotedIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(VOTED_IDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as string[];
  } catch (e) {
    console.warn("Failed to load voted ids from storage", e);
    return [];
  }
}

export async function persistVotedIds(ids: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(VOTED_IDS_KEY, JSON.stringify(ids));
  } catch (e) {
    console.warn("Failed to persist voted ids to storage", e);
  }
}

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Idea, NewIdeaInput } from "../types";
import { generateFakeScore } from "../utils/scoring";
import { generateId } from "../utils/id";
import { loadIdeas, loadVotedIds, persistIdeas, persistVotedIds } from "../utils/storage";

interface IdeasContextValue {
  ideas: Idea[];
  votedIds: string[];
  isLoading: boolean;
  addIdea: (input: NewIdeaInput) => Promise<Idea>;
  upvoteIdea: (id: string) => Promise<{ success: boolean; alreadyVoted: boolean }>;
  hasVoted: (id: string) => boolean;
}

const IdeasContext = createContext<IdeasContextValue | undefined>(undefined);

export const IdeasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [votedIds, setVotedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [storedIdeas, storedVotedIds] = await Promise.all([loadIdeas(), loadVotedIds()]);
      setIdeas(storedIdeas);
      setVotedIds(storedVotedIds);
      setIsLoading(false);
    })();
  }, []);

  const addIdea = async (input: NewIdeaInput): Promise<Idea> => {
    const { rating, insight } = generateFakeScore(input);
    const newIdea: Idea = {
      id: generateId(),
      name: input.name.trim(),
      tagline: input.tagline.trim(),
      description: input.description.trim(),
      rating,
      insight,
      votes: 0,
      createdAt: Date.now()
    };
    const updated = [newIdea, ...ideas];
    setIdeas(updated);
    await persistIdeas(updated);
    return newIdea;
  };

  const hasVoted = (id: string) => votedIds.includes(id);

  const upvoteIdea = async (id: string): Promise<{ success: boolean; alreadyVoted: boolean }> => {
    if (votedIds.includes(id)) {
      return { success: false, alreadyVoted: true };
    }
    const updatedIdeas = ideas.map((idea) => (idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea));
    const updatedVotedIds = [...votedIds, id];
    setIdeas(updatedIdeas);
    setVotedIds(updatedVotedIds);
    await Promise.all([persistIdeas(updatedIdeas), persistVotedIds(updatedVotedIds)]);
    return { success: true, alreadyVoted: false };
  };

  const value = useMemo(
    () => ({ ideas, votedIds, isLoading, addIdea, upvoteIdea, hasVoted }),
    [ideas, votedIds, isLoading]
  );

  return <IdeasContext.Provider value={value}>{children}</IdeasContext.Provider>;
};

export function useIdeas(): IdeasContextValue {
  const ctx = useContext(IdeasContext);
  if (!ctx) throw new Error("useIdeas must be used within an IdeasProvider");
  return ctx;
}

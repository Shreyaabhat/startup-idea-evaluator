/**
 * Generates a reasonably unique ID without pulling in an external uuid
 * dependency. Combines a timestamp (base36) with two random segments.
 */
export function generateId(): string {
  const timePart = Date.now().toString(36);
  const randomPartA = Math.random().toString(36).slice(2, 8);
  const randomPartB = Math.random().toString(36).slice(2, 8);
  return `idea_${timePart}_${randomPartA}${randomPartB}`;
}

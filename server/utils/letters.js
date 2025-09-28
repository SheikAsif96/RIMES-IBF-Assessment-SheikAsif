export const letters = ["r", "i", "m", "e", "s"];

export function countLetters(text) {
  const counts = { r: 0, i: 0, m: 0, e: 0, s: 0 };
  const t = (text || "").toLowerCase();
  for (const ch of t) {
    if (counts.hasOwnProperty(ch)) counts[ch] += 1;
  }
  return counts;
}

export function deltaCounts(oldText, newText) {
  const oldC = countLetters(oldText || "");
  const newC = countLetters(newText || "");
  const delta = { r: 0, i: 0, m: 0, e: 0, s: 0 };
  for (const l of letters) delta[l] = newC[l] - oldC[l];
  return delta;
}

// Coin / dot pattern pictures for the practice papers ("Lily uses coins to make a growing pattern").
// Each pattern is a list of row lengths, drawn top to bottom and centred, e.g. [4, 2] is a row of 4 above a row of 2.

const GAP = 18; // distance between dot centres
const R = 7; // dot radius
const PAD = 14; // space around each pattern

/** Patterns side by side, labelled "Pattern 1", "Pattern 2" … underneath. */
export function dotPatterns(patterns: number[][], noun = "coins"): string {
  const widths = patterns.map((rows) => Math.max(...rows) * GAP + PAD * 2);
  const tallest = Math.max(...patterns.map((rows) => rows.length));
  const dotsHeight = tallest * GAP + PAD;
  const height = dotsHeight + 30;
  const width = widths.reduce((s, w) => s + w, 0) + (patterns.length - 1) * 16;
  const parts: string[] = [];
  let left = 0;
  patterns.forEach((rows, i) => {
    const w = widths[i];
    const top = PAD + (tallest - rows.length) * GAP; // patterns sit on a common baseline
    rows.forEach((count, r) => {
      const y = top + r * GAP + R;
      const x0 = left + (w - (count - 1) * GAP) / 2;
      for (let k = 0; k < count; k++) parts.push(`<circle cx="${x0 + k * GAP}" cy="${y}" r="${R}" fill="#64748b"/>`);
    });
    parts.push(`<text x="${left + w / 2}" y="${dotsHeight + 20}" text-anchor="middle" font-size="13" font-family="sans-serif" fill="#334155">Pattern ${i + 1}</text>`);
    if (i < patterns.length - 1) {
      const x = left + w + 8;
      parts.push(`<line x1="${x}" y1="${PAD}" x2="${x}" y2="${dotsHeight}" stroke="#cbd5e1" stroke-width="1"/>`);
    }
    left += w + 16;
  });
  const label = `Growing pattern of ${noun}: patterns 1 to ${patterns.length}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">${parts.join("")}</svg>`;
}

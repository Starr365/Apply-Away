/**
 * Email colour tokens, derived from the application theme.
 *
 *
 * IMPORTANT: these triplets are the same numbers as in globals.css. If a token
 * changes there, change it here too — there is no way to import CSS custom
 * properties into the Node runtime that generates these emails.
 */

/** HSL triplets copied verbatim from `:root` in src/app/globals.css. */
const TOKENS = {
  background: [222.2, 47.4, 11.2],
  foreground: [214.3, 31.8, 91.4],
  card: [215.4, 25, 17.3],
  cardForeground: [214.3, 31.8, 91.4],
  primary: [198.6, 92.8, 59.6],
  primaryForeground: [222.2, 47.4, 11.2],
  secondary: [215.4, 16.3, 27.1],
  secondaryForeground: [214.3, 31.8, 91.4],
  mutedForeground: [215.4, 16.3, 65],
  border: [215.4, 16.3, 27.1],
  destructive: [0, 62.8, 30.6],
  destructiveForeground: [210, 40, 98],
} as const satisfies Record<string, readonly [number, number, number]>;

/**
 * Convert an `H S% L%` triplet to a `#rrggbb` string.
 * Mirrors what the browser does for `hsl(var(--token))`.
 */
function hslToHex(h: number, s: number, l: number): string {
  const sat = s / 100;
  const lum = l / 100;

  const c = (1 - Math.abs(2 * lum - 1)) * sat;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  const m = lum - c / 2;

  const [r, g, b] =
    hp < 1 ? [c, x, 0] :
      hp < 2 ? [x, c, 0] :
        hp < 3 ? [0, c, x] :
          hp < 4 ? [0, x, c] :
            hp < 5 ? [x, 0, c] :
              [c, 0, x];

  const toChannel = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toChannel(r)}${toChannel(g)}${toChannel(b)}`;
}

type TokenName = keyof typeof TOKENS;

/** Resolved hex for every theme token, e.g. `emailTheme.primary === "#38bdf8"`. */
export const emailTheme = Object.fromEntries(
  Object.entries(TOKENS).map(([name, [h, s, l]]) => [name, hslToHex(h, s, l)])
) as Record<TokenName, string>;

/** Shared border radius, mirroring `--radius: 0.75rem` in globals.css. */
export const emailRadius = "12px";

// The text size choices from the design tokens: Compact to Extra large.

import { tokens } from "@igongo/design-tokens/tokens";

/** One text size a person can pick in Settings. */
export interface TextSize {
  /** The key saved in preferences. */
  key: keyof typeof SCALES;
  /** The name shown in Settings. */
  label: string;
  /** How much bigger than standard the text is. */
  scale: number;
}

// The numbers come only from the tokens file.
const SCALES = {
  compact: tokens.textScale.compact,
  standard: tokens.textScale.standard,
  comfortable: tokens.textScale.comfortable,
  large: tokens.textScale.large,
  extraLarge: tokens.textScale.extraLarge,
};

/** Every text size, smallest first. */
export const TEXT_SIZES: TextSize[] = [
  { key: "compact", label: "Compact", scale: SCALES.compact },
  { key: "standard", label: "Standard", scale: SCALES.standard },
  { key: "comfortable", label: "Comfortable", scale: SCALES.comfortable },
  { key: "large", label: "Large", scale: SCALES.large },
  { key: "extraLarge", label: "Extra large", scale: SCALES.extraLarge },
];

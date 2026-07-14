export interface Token {
  $value: string;
  $type: string;
}

export interface ContrastReportItem {
  textColor: string;
  backgroundColor: string;
  ratio: string;
  passed: boolean;
}

export interface ContrastReport {
  primaryPair: ContrastReportItem;
  secondaryPair: ContrastReportItem;
  surfacePair: ContrastReportItem;
}

// Convert hex string to RGB object
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove starting hash
  let cleanHex = hex.replace(/^#/, "");

  // Expand short 3-digit or 4-digit hex to 6-digit or 8-digit hex
  if (cleanHex.length === 3 || cleanHex.length === 4) {
    cleanHex = cleanHex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // Handle 8-digit hex (discard alpha for standard parsing, but alpha is checked separately)
  if (cleanHex.length === 8) {
    cleanHex = cleanHex.substring(0, 6);
  }

  if (cleanHex.length !== 6) {
    return null;
  }

  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Convert RGB components to hex string
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => {
    const hex = Math.max(0, Math.min(255, c)).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// Calculate relative luminance based on WCAG 2.1 formula
export function getRelativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const a = [rgb.r, rgb.g, rgb.b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

// Calculate contrast ratio between two colors
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Mix color with white at a given ratio (0.9 = 90% white, 10% base color)
export function mixWithWhite(hex: string, whiteRatio: number = 0.9): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#FFFFFF";

  const r = Math.round(rgb.r * (1 - whiteRatio) + 255 * whiteRatio);
  const g = Math.round(rgb.g * (1 - whiteRatio) + 255 * whiteRatio);
  const b = Math.round(rgb.b * (1 - whiteRatio) + 255 * whiteRatio);

  return rgbToHex(r, g, b);
}

// Darken a color step-by-step
export function darkenColor(hex: string, factor: number = 0.93): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#000000";

  const r = Math.max(0, Math.floor(rgb.r * factor));
  const g = Math.max(0, Math.floor(rgb.g * factor));
  const b = Math.max(0, Math.floor(rgb.b * factor));

  return rgbToHex(r, g, b);
}

// Main post-processing logic to validate and adjust design system tokens
export function validateAndFixContrast(tokens: unknown): {
  tokens: unknown;
  contrastReport: ContrastReport;
} {
  // Deep clone tokens to avoid mutating inputs
  const fixedTokens = JSON.parse(JSON.stringify(tokens)) as Record<
    string,
    Record<string, Record<string, string>>
  >;

  // Helper to validate and fix a specific text/background token pair
  const fixPair = (textTokenKey: string, bgTokenKey: string): ContrastReportItem => {
    let textColor = fixedTokens.color[textTokenKey].$value;
    let bgColor = fixedTokens.color[bgTokenKey].$value;

    let ratio = getContrastRatio(textColor, bgColor);

    if (ratio < 4.5) {
      // 1. Try white text
      const ratioWithWhite = getContrastRatio("#FFFFFF", bgColor);
      // 2. Try black text
      const ratioWithBlack = getContrastRatio("#000000", bgColor);

      if (ratioWithWhite >= 4.5) {
        textColor = "#FFFFFF";
        ratio = ratioWithWhite;
      } else if (ratioWithBlack >= 4.5) {
        textColor = "#000000";
        ratio = ratioWithBlack;
      } else {
        // Background is a mid-tone where neither white nor black text passes
        // Darken the background color step-by-step until white text passes
        textColor = "#FFFFFF";
        let tempBg = bgColor;
        let limit = 0;

        while (getContrastRatio("#FFFFFF", tempBg) < 4.5 && limit < 100) {
          tempBg = darkenColor(tempBg);
          limit++;
        }

        bgColor = tempBg;
        ratio = getContrastRatio("#FFFFFF", bgColor);
      }

      // Update values in our tokens clone
      fixedTokens.color[textTokenKey].$value = textColor;
      fixedTokens.color[bgTokenKey].$value = bgColor;
    }

    return {
      textColor,
      backgroundColor: bgColor,
      ratio: ratio.toFixed(2) + ":1",
      passed: ratio >= 4.5,
    };
  };

  // Run validation on the three requested pairs
  const primaryPair = fixPair("on-primary", "primary");
  const secondaryPair = fixPair("on-secondary", "secondary");
  const surfacePair = fixPair("on-surface", "surface");

  // Handle primary-container mixing logic
  const primaryContainerVal = fixedTokens.color["primary-container"].$value;
  const isEightDigitHex =
    /^#[0-9A-Fa-f]{8}$/.test(primaryContainerVal) || primaryContainerVal.length === 9;

  if (isEightDigitHex) {
    // Generate solid light tint by mixing the primary color with white at 90%
    const currentPrimary = fixedTokens.color.primary.$value;
    const solidTint = mixWithWhite(currentPrimary, 0.9);
    fixedTokens.color["primary-container"].$value = solidTint;
  }

  const contrastReport: ContrastReport = {
    primaryPair,
    secondaryPair,
    surfacePair,
  };

  return {
    tokens: fixedTokens,
    contrastReport,
  };
}

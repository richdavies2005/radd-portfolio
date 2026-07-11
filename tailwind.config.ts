import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Replacing (not extending) colors/fontSize/zIndex — utilities should
    // map to RADD's tokens, not Tailwind's generic defaults.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      canvas: "rgb(var(--color-canvas) / <alpha-value>)",
      "canvas-raised": "rgb(var(--color-canvas-raised) / <alpha-value>)",
      ink: "rgb(var(--color-ink) / <alpha-value>)",
      "ink-muted": "rgb(var(--color-ink-muted) / <alpha-value>)",
      flame: "rgb(var(--color-flame) / <alpha-value>)",
      "flame-text": "rgb(var(--color-flame-text) / <alpha-value>)",
      cobalt: "rgb(var(--color-cobalt) / <alpha-value>)",
      acid: "rgb(var(--color-acid) / <alpha-value>)",
      paper: "rgb(var(--color-paper) / <alpha-value>)",
    },
    fontFamily: {
      display: ["var(--font-display)"],
      body: ["var(--font-body)"],
      label: ["var(--font-label)"],
    },
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1.5" }],
      sm: ["0.875rem", { lineHeight: "1.5" }],
      base: ["1rem", { lineHeight: "1.6" }],
      lg: ["1.125rem", { lineHeight: "1.6" }],
      xl: ["1.375rem", { lineHeight: "1.4" }],
      "2xl": ["1.75rem", { lineHeight: "1.3" }],
      "3xl": ["2.25rem", { lineHeight: "1.2" }],
      "4xl": ["3rem", { lineHeight: "1.1" }],
      "5xl": ["3.75rem", { lineHeight: "1.05" }],
      "6xl": ["4.75rem", { lineHeight: "1" }],
      "7xl": ["6rem", { lineHeight: "0.95" }],
      "8xl": ["7.5rem", { lineHeight: "0.92" }],
      "9xl": ["clamp(5rem, 4vw + 4rem, 9rem)", { lineHeight: "0.9" }],
      "10xl": ["clamp(6rem, 6vw + 4rem, 11rem)", { lineHeight: "0.88" }],
    },
    spacing: {
      0: "0px",
      1: "8px",
      2: "16px",
      3: "24px",
      4: "32px",
      5: "40px",
      6: "48px",
      8: "64px",
      10: "80px",
      12: "96px",
      16: "128px",
      20: "160px",
      24: "192px",
      32: "256px",
      px: "1px",
      0.5: "4px",
    },
    zIndex: {
      content: "0",
      overlap: "10",
      type: "20",
      sticky: "30",
      nav: "40",
      modal: "100",
      // The custom cursor must sit above everything, including modals/lightbox.
      cursor: "1000",
    },
    extend: {
      maxWidth: {
        container: "1440px",
      },
    },
  },
  plugins: [],
};
export default config;

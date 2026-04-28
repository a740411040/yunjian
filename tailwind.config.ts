import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx,mdx}",
    "./src/hooks/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-sans-cn)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ],
        serif: [
          "var(--font-serif-cn)",
          "Songti SC",
          "STSong",
          "SimSun",
          "Noto Serif SC",
          "serif"
        ]
      },
      boxShadow: {
        paper: "0 24px 80px rgba(28, 28, 30, 0.06)",
        seal: "0 10px 28px rgba(192, 72, 81, 0.22)",
        soft: "0 16px 50px rgba(36, 52, 71, 0.08)"
      },
      borderRadius: {
        ink: "28px",
        seal: "999px"
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "ink-fade": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        }
      },
      animation: {
        "float-slow": "float-slow 6s ease-in-out infinite",
        "ink-fade": "ink-fade 700ms ease-out both"
      }
    }
  }
};

export default config;

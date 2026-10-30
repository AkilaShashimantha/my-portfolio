import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F6F4F0",
          card: "#EFECE6",
          elevated: "#FBF9F6",
        },
        ink: {
          DEFAULT: "#161615",
          muted: "#63605A",
          subtle: "#8D8982",
        },
        borderHairline: {
          DEFAULT: "#DCD8CF",
          strong: "#CBC6BA",
        },
        terracotta: {
          DEFAULT: "#C84B31",
          hover: "#B33E26",
          subtle: "#F9ECE9",
        },
        olive: {
          DEFAULT: "#2A3B32",
          hover: "#213028",
          subtle: "#E9EFEA",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Newsreader", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        editorial: "0 1px 3px rgba(22, 22, 21, 0.04), 0 6px 16px rgba(22, 22, 21, 0.03)",
        card: "0 2px 8px rgba(22, 22, 21, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;

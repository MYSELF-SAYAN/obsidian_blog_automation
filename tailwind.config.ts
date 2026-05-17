import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#faf9f5",
        primary: "#cc785c",
        coral: "#cc785c",
        navy: "#1a1a2e",
        surface: "#1a1a2e",
        "surface-light": "#2d2d44",
        text: "#2a2a2a",
        "text-muted": "#707070",
        accent: "#f4a460",
      },
      fontFamily: {
        serif: [
          "Tiempos Headline",
          "Copernicus",
          "Georgia",
          "serif",
        ],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      spacing: {
        xxs: "4px",
        xs: "6px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
        "3xl": "48px",
        section: "96px",
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      fontSize: {
        xs: ["12px", { lineHeight: "1.5" }],
        sm: ["14px", { lineHeight: "1.6" }],
        base: ["16px", { lineHeight: "1.6" }],
        lg: ["18px", { lineHeight: "1.7" }],
        xl: ["20px", { lineHeight: "1.7" }],
        "2xl": ["24px", { lineHeight: "1.8" }],
        "3xl": ["30px", { lineHeight: "1.8" }],
        "4xl": ["36px", { lineHeight: "1.9" }],
        "5xl": ["48px", { lineHeight: "1.9" }],
      },
    },
  },
  plugins: [],
};
export default config;

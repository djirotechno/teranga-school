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
        background: "var(--background)",
        foreground: "var(--foreground)",
        teranga: {
          dark: "#0F3833",
          darker: "#0B2B27",
          cardDark: "#184540",
          orange: "#E75A24",
          orangeHover: "#D04D1B",
          cream: "#F7F4EE",
          creamLight: "#FAF8F4",
          creamInput: "#ECE5D8",
          charcoal: "#1F2937",
          muted: "#6B7280",
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
};
export default config;


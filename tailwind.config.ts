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
        primary: {
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
        },
        blue: "var(--blue)",
        "gray-dark": "var(--gray-dark)",
        "gray-light": "var(--gray-light)",
        yellow: {
          100: "var(--yellow-100)",
          200: "var(--yellow-200)",
        },
      },
      fontFamily: {
        recoletaAlt: ["var(--font-recoletaAlt-semiBold)"],
        mulish: ["var(--font-mulish)"],
      },
    },
  },
  plugins: [],
};
export default config;

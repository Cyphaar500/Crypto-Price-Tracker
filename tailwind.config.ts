import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    './node_modules/antd/dist/antd.css',
  ], 
  theme: {
    extend: {
      transitionProperty: {
        colors: 'background-color, border-color, color, fill, stroke',
      },
    },
  },
  
  plugins: [],
};
export default config;

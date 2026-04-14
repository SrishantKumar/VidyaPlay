/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Child Hub - Bold & Colorful
        "child-primary": "#FF5722", // Vibrant Orange
        "child-secondary": "#1A237E", // Indigo
        "child-accent": "#FFD600", // Bright Yellow
        "child-success": "#4CAF50", // Green
        "child-danger": "#F44336", // Red
        "child-surface": "#F5F3FF", // Soft Lavender background
        
        // Parent Dashboard - Clean & Minimal
        "parent-primary": "#0F172A", // Slate 900
        "parent-secondary": "#64748B", // Slate 500
        "parent-accent": "#6366F1", // Indigo 500
        
        // Neutrals
        "bg-light": "#FAFAFA",
        "bg-dark": "#0F172A",
        "text-primary": "#1E293B",
        "text-secondary": "#64748B",
        "border-light": "#F1F5F9",
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
    },
  },
  plugins: [],
};

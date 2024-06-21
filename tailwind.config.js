// tailwind.config.js
module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class", // Enable dark mode based on the class 'dark'
  theme: {
    extend: {
      colors: {
        github: {
          "dark-blue": "#0D1117",
          "gray-bg": "#161B22",
          green: "#2EA043",
          blue: "#0366D6",
          purple: "#6f42c1",
          yellow: "#ffd33d",
          orange: "#FF6F0F",
          red: "#d73a49",
          white: "#FFFFFF",
        },
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["dark", "hover"],
      textColor: ["dark", "hover"],
      borderColor: ["dark"],
    },
  },
  plugins: [],
};

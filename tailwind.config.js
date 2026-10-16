/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Sampled from design/splashscreen & authscreen-ref.png
      colors: {
        primary: "#1F74FD",
        ink: "#0B1128",
        muted: "#6E7C99",
        subtle: "#8491AC",
        link: "#1F6FFB",
        border: "#DDE4EF",
        divider: "#EBEFF7",
        background: "#FBFCFE",
        danger: "#FF3B30",
      },
      // Each Inter weight is a separate family in React Native.
      fontFamily: {
        inter: ["Inter_400Regular"],
        "inter-medium": ["Inter_500Medium"],
        "inter-semibold": ["Inter_600SemiBold"],
        "inter-bold": ["Inter_700Bold"],
      },
    },
  },
  plugins: [],
};

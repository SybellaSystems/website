module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a', // Dark blue from the design
        accent: '#16a34a', // Green from the design
        yellow: '#eab308', // Yellow accent from the design
        'dark-blue': '#1e3a8a',
        'light-green': '#22c55e',
        // Dark mode colors
        'dark-bg': '#0f172a',
        'dark-surface': '#1e293b',
        'dark-text': '#f1f5f9',
        'dark-text-secondary': '#cbd5e1'
      }
    }
  },
  plugins: []
}

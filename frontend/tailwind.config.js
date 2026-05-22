/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50:"#eef5fb",100:"#d6e8f5",500:"#0a66c2",600:"#0958a8",700:"#074a8e" },
      },
    },
  },
  plugins: [],
};

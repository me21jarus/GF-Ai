/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#ff6b6b",
                secondary: "#fca5a5",
                accent: "#fecaca",
                background: "#fdf2f8", // pink-50
            },
            animation: {
                "bounce-slow": "bounce 3s infinite",
            },
        },
    },
    plugins: [],
}

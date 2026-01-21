/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#3c7c65",
                "background-light": "#f7f7f7",
                "background-dark": "#1a1b1e",
                "charcoal": "#1a1a1a",
                "muted-gray": "#6d7e77",
                "border-light": "#e5e7eb",
                "border-dark": "#2d2e32",
                "muted-blue": "#5b8ba8",
                "accent-red": "#B5523B",
            },
            fontFamily: {
                "display": ["Manrope", "sans-serif"],
                "heading": ["Epilogue", "sans-serif"],
                "editorial": ["Epilogue", "sans-serif"],
                "serif": ["Epilogue", "sans-serif"],
            },
            borderRadius: {
                "DEFAULT": "0.125rem",
                "lg": "0.25rem",
                "xl": "0.5rem",
                "full": "0.75rem",
            },
        },
    },
    plugins: [],
}

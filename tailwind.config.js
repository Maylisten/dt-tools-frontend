/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    '50': '#eef8ff',
                    '100': '#d9eeff',
                    '200': '#bce3ff',
                    '300': '#8ed2ff',
                    '400': '#59b7ff',
                    '500': '#409eff',
                    '600': '#1b78f5',
                    '700': '#1461e1',
                    '800': '#174eb6',
                    '900': '#19448f',
                    '950': '#142b57',
                },
            }
        },
    },
    plugins: [],
};


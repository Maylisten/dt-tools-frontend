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
                success: {
                    '50': '#f3fbf2',
                    '100': '#e3f7e1',
                    '200': '#c7eec4',
                    '300': '#9bdf96',
                    '400': '#68c761',
                    '500': '#42ac3b',
                    '600': '#328d2c',
                    '700': '#2f7c2a',
                    '800': '#255922',
                    '900': '#20491e',
                    '950': '#0c280b',
                },

            }
        },
    },
    plugins: [],
};


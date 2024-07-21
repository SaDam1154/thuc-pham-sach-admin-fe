/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
        './node_modules/react-tailwindcss-datepicker/dist/index.esm.js',
    ],
    theme: {
        extend: {
            boxShadow: {
                test: '0 0 1px 1px red',
            },
            padding: {
                'p-body': '24px',
            },
        },
    },
    plugins: [],
};

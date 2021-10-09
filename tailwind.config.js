const colors = require('tailwindcss/colors')
module.exports = {
    purge: [
        './src/pages/**/*.{ts,tsx,js,jsx}',
        './src/components/**/*.{ts,tsx,js,jsx}',
    ],
    mode: 'jit',
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                gray: colors.trueGray,
            },
            fontFamily: {
                Poppins: ['Poppins', 'sans-serif'],
            },
            backgroundImage: {
                hero: 'linear-gradient(to bottom,rgba(0,0,0,.2),rgba(0,0,0,.4)),url("/images/boat-image.jpg")',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require('@tailwindcss/forms')],
}

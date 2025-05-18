/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        container: {
            center: true,
        },
        extend: {
            colors: {
                // Core brand colors
                primary: {
                    DEFAULT: '#2E2787', // Deep indigo
                    light: '#e8eaf6', // Light indigo tint
                    'dark-light': 'rgba(46, 39, 135, 0.15)',
                },
                secondary: {
                    DEFAULT: '#FF6B35', // Coral-orange
                    light: '#ffeae0', // Light orange tint
                    'dark-light': 'rgba(255, 107, 53, 0.15)',
                },

                // Semantic colors
                success: {
                    DEFAULT: '#2E2787', // Using primary for trust
                    light: '#e8eaf6',
                    'dark-light': 'rgba(46, 39, 135, 0.15)',
                },
                danger: {
                    DEFAULT: '#D32F2F', // Error red
                    light: '#fee2e2',
                    'dark-light': 'rgba(211, 47, 47, 0.15)',
                },
                warning: {
                    DEFAULT: '#FF6B35', // Secondary = alerts
                    light: '#fff0e6',
                    'dark-light': 'rgba(255, 107, 53, 0.15)',
                },
                info: {
                    DEFAULT: '#2196F3', // Retained blue for info
                    light: '#e3f2fd',
                    'dark-light': 'rgba(33, 150, 243, 0.15)',
                },

                // Neutrals (from design system)
                dark: {
                    DEFAULT: '#2D2D2D', // Body text
                    light: '#6D6D6D', // Secondary text
                    'dark-light': 'rgba(45, 45, 45, 0.15)',
                },
                black: {
                    DEFAULT: '#0e1726', // Deep dark
                    light: '#2D2D2D', // Dark gray
                    'dark-light': 'rgba(14, 23, 38, 0.15)',
                },
                white: {
                    DEFAULT: '#FFFFFF',
                    light: '#F4F4F4', // Backgrounds
                    dark: '#6D6D6D', // Borders
                },
            },
            fontFamily: {
                sans: ['Charlie', 'sans-serif'], // Charlie as default font
                Charlie: ['Charlie', 'sans-serif']
            },
            spacing: {
                4.5: '18px',
            },
            boxShadow: {
                '3xl': '0 2px 2px rgba(46, 39, 135, 0.05), 1px 6px 7px rgba(46, 39, 135, 0.1)', // Indigo-tinted
                urgent: '0 4px 14px -2px rgba(255, 107, 53, 0.25)', // Orange shadow
            },
            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        '--tw-prose-invert-headings': theme('colors.white'),
                        '--tw-prose-invert-links': theme('colors.secondary.DEFAULT'),
                        h1: { fontSize: '40px', color: theme('colors.primary.DEFAULT') },
                        h2: { fontSize: '32px', color: theme('colors.primary.DEFAULT') },
                        h3: { fontSize: '28px', color: theme('colors.primary.DEFAULT') },
                        a: {
                            color: theme('colors.secondary.DEFAULT'),
                            '&:hover': { color: theme('colors.secondary.DEFAULT') },
                        },
                    },
                },
            }),
        },
    },
    variants: {
        opacity: ({ after }) => after(['disabled']),
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
        require('@tailwindcss/typography'),
    ],
};

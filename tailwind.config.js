/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './sections/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Fondo Oscuro Profundo
                background: '#09090b',
                // Texto Claro
                foreground: '#FAFAFA',
                muted: '#A1A1AA',
                // Acento Dorado
                primary: {
                    DEFAULT: '#F59E0B',
                    light: '#FCD34D',
                    dark: '#B45309',
                },
                // Acento Secundario
                accent: {
                    DEFAULT: '#D4A574',
                    light: '#E8C9A0',
                    dark: '#B88B5A',
                },
                // Superficies
                surface: {
                    DEFAULT: '#18181B',
                    elevated: '#27272A',
                },
                // Bordes
                border: '#3F3F46',
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                display: ['var(--font-playfair)', 'serif'],
            },
        },
    },
    plugins: [],
};

import { fontFamily } from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				// Primary brand colors
				primary: {
					DEFAULT: '#2563eb',
					light: '#3b82f6',
					dark: '#1d4ed8',
				},
				// Accent colors
				accent: {
					DEFAULT: '#14b8a6',
					light: '#5eead4',
					dark: '#0f766e',
				},
			},
			fontFamily: {
				sans: ['Inter', ...fontFamily.sans],
			},
		},
	},
	plugins: [],
} 
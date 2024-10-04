import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		gridTemplateColumns: {
			'12': 'repeat(12, minmax(0, 1fr))',
		},
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				primary: {
					light: 'var(--primary-light)',
					'light-hover': 'var(--primary-light-hover)',
					'light-active': 'var(--primary-light-active)',
					normal: 'var(--primary-normal)',
					'normal-hover': 'var(--primary-normal-hover)',
					'normal-active': 'var(--primary-normal-active)',
					dark: 'var(--primary-dark)',
					'dark-hover': 'var(--primary-dark-hover)',
					'dark-active': 'var(--primary-dark-active)',
					darker: 'var(--primary-darker)',
				},
				secondary: {
					light: 'var(--secondary-light)',
					'light-hover': 'var(--secondary-light-hover)',
					'light-active': 'var(--secondary-light-active)',
					normal: 'var(--secondary-normal)',
					'normal-hover': 'var(--secondary-normal-hover)',
					'normal-active': 'var(--secondary-normal-active)',
					dark: 'var(--secondary-dark)',
					'dark-hover': 'var(--secondary-dark-hover)',
					'dark-active': 'var(--secondary-dark-active)',
					darker: 'var(--secondary-darker)',
				},
				tertiary: {
					light: 'var(--tertiary-light)',
					'light-hover': 'var(--tertiary-light-hover)',
					'light-active': 'var(--tertiary-light-active)',
					normal: 'var(--tertiary-normal)',
					'normal-hover': 'var(--tertiary-normal-hover)',
					'normal-active': 'var(--tertiary-normal-active)',
					dark: 'var(--tertiary-dark)',
					'dark-hover': 'var(--tertiary-dark-hover)',
					'dark-active': 'var(--tertiary-dark-active)',
					darker: 'var(--tertiary-darker)',
				},
			},
			fontSize: {
				'66': 'var(--font-size-66)' /* 66px */,
				'52': 'var(--font-size-52)' /* 52px */,
				'32': 'var(--font-size-32)' /* 32px */,
				'29': 'var(--font-size-29)' /* 29px */,
				'26': 'var(--font-size-26)' /* 26px */,
				'23': 'var(--font-size-23)' /* 23px */,
				'20': 'var(--font-size-20)' /* 20px */,
				'18': 'var(--font-size-18)' /* 18px */,
				'16': 'var(--font-size-16)' /* 16px */,
				'14': 'var(--font-size-14)' /* 14px */,
				'13': 'var(--font-size-13)' /* 13px */,
			},
			fontWeight: {
				thin: '100',
				extralight: '200',
				light: '300',
				regular: '400',
				medium: '500',
				semibold: '600',
				bold: '700',
				extrabold: '800',
				black: '900',
			},
			animation: {
				normal: '1s linear',
			},
		},
	},
	plugins: [],
};
export default config;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	sassOptions: {
		implementation: 'sass-embedded',
	},
	env: {
		API_URL: process.env.API_URL,
	},
};

export default nextConfig;

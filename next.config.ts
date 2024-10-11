import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	sassOptions: {
		implementation: 'sass-embedded',
	},
	// images: {
	// 	remotePatterns: [
	// 		{
	// 			protocol: 'https',
	// 			hostname: 'assets.example.com',
	// 			port: '',
	// 			pathname: '/account123/**',
	// 		},
	// 	],
	// },
};

export default nextConfig;

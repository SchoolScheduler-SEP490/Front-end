import type { NextConfig } from 'next';
import { Header } from 'next/dist/lib/load-custom-routes';
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;
const nextConfig: NextConfig = {
	sassOptions: {
		implementation: 'sass-embedded',
	},
	source: '/(.*)',
	headers: async () => [
		{
			key: 'Content-Security-Policy',
			value: cspHeader.replace(/\n/g, ''),
		} as unknown as Header,
	],
};

export default nextConfig;

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
	headers: async () => [
		{
			key: 'Content-Security-Policy',
			value: `
			default-src 'self'; 
			script-src 'self' 'wasm-unsafe-eval' 'inline-speculation-rules' 'chrome-extension://9d50b3b1-7d63-4009-9b1b-3bf8d973d69e';	
			script-src 'self' 'wasm-unsafe-eval' 'inline-speculation-rules' 'chrome-extension://572a7de1-05c9-48da-b6e8-1a46d3a257be';
			style-src 'self' https://trustedstyles.com; 
			img-src 'self' data: https://trustedimages.com; 
			connect-src 'self'; 
			frame-src 'self' https://trustedframes.com;
		  `.replace(/\n/g, ''), // Loại bỏ dòng trắng để CSP không bị ngắt
		} as unknown as Header,
	],
};

export default nextConfig;

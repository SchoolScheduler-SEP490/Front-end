import '@/commons/styles/globals.css';
import AppProvider from '@/context/app_provider';
import { inter } from '@/utils/fonts';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
	icons: ['/images/logo.png'],
	title: {
		template: 'Schedulify | %s',
		default: 'Schedulify | Trang chủ',
	},
	description: 'Hệ thống xây dựng Thời khóa biểu online',
	metadataBase: new URL('https://schedulify-se078.vercel.app'),
};
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = cookies();
	const sessionToken = cookieStore.get('sessionToken');
	const refreshToken = cookieStore.get('refreshToken');

	return (
		<html lang='vi'>
			<body
				className={`${inter.className} antialiased w-screen h-screen overflow-x-hidden scroll-smooth`}
			>
				<AppProvider
					inititalSessionToken={sessionToken?.value}
					inititalRefreshToken={refreshToken?.value}
				>
					{children}
				</AppProvider>
			</body>
		</html>
	);
}

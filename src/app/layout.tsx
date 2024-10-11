import type { Metadata } from 'next';
import '@/commons/styles/globals.css';
import { inter } from '@/utils/fonts';
import AppProvider from '@/context/app_provider';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
	icons: ['/images/logo.png'],
	title: 'Schedulify | Trang chủ',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = cookies();
	const sessionToken = cookieStore.get('sessionToken');

	return (
		<html lang='vi'>
			<body
				className={`${inter.className} antialiased w-screen h-screen overflow-x-hidden`}
			>
				<AppProvider inititalSessionToken={sessionToken?.value}>
					{children}
				</AppProvider>
			</body>
		</html>
	);
}

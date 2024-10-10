import '@/commons/styles/globals.css';
import { inter } from '@/utils/fonts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	icons: ['/images/logo.png'],
	title: 'Schedulify | Thời khóa biểu',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='vi'>
			<body className={`${inter.className} antialiased w-screen h-screen`}>
				{children}
			</body>
		</html>
	);
}

import SMHeader from '@/commons/school_manager/header';
import SMSidenav from '@/commons/school_manager/sidenav';
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
			<head>
				<link rel='stylesheet' href='@/commons/styles/globals.css' />
			</head>
			<body
				className={`${inter.className} antialiased w-screen h-screen overflow-x-hidden scroll-smooth flex flex-row justify-start items-start`}
			>
				<div className='w-[20%] h-screen'>
					<SMSidenav />
				</div>
				<div className='w-[80%] h-screen flex flex-col justify-start items-start'>
					<SMHeader />
					{children}
				</div>
			</body>
		</html>
	);
}

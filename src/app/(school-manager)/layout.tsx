import SMSidenav from '@/commons/school_manager/sidenav';
import '@/commons/styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	icons: ['/images/logo.png'],
	title: 'Schedulify | Thời khóa biểu',
};

export default function SMLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<section className='w-screen h-fit min-h-screen flex flex-row justify-start items-start'>
			<SMSidenav />
			{children}
		</section>
	);
}

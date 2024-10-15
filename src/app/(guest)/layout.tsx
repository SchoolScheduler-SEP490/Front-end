import type { Metadata } from 'next';
import '@/commons/styles/globals.css';
import { inter } from '@/utils/fonts';
import Header from '@/commons/header';
import Footer from '@/commons/footer';

export const metadata: Metadata = {
	icons: ['/images/logo.png'],
	title: 'Schedulify | Trang chủ',
};

export default function GuestLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<section>
			<Header />
			{children}
			<Footer />
		</section>
	);
}

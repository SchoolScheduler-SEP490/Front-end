import Footer from '@/commons/footer';
import Header from '@/commons/header';
import '@/commons/styles/globals.css';
import type { Metadata } from 'next';

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

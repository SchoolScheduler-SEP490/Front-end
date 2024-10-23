'use client';
import Footer from '@/commons/footer';
import Header from '@/commons/header';
import { useAppContext } from '@/context/app_provider';
import { redirect } from 'next/navigation';
import { useMemo } from 'react';

export default function GuestLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { userRole } = useAppContext();

	useMemo(() => {
		if (userRole.length > 0) {
			redirect('/');
		}
	}, [userRole]);

	return (
		<section>
			<Header />
			{children}
			<Footer />
		</section>
	);
}

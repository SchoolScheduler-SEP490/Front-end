'use client';
import Footer from '@/commons/footer';
import Header from '@/commons/header';
import { useAppContext } from '@/context/app_provider';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

export default function GuestLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { sessionToken, userRole } = useAppContext();
	const router = useRouter();
	useMemo(() => {
		if (sessionToken && userRole.length > 0) {
			router.push('/');
		}
	}, [sessionToken]);

	return (
		<section>
			<Header />
			{children}
			<Footer />
		</section>
	);
}

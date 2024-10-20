'use client';
import Footer from '@/commons/footer';
import Header from '@/commons/header';
import { useAppContext } from '@/context/app_provider';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { sessionToken } = useAppContext();
	const router = useRouter();
	useMemo(() => {
		if (sessionToken) {
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

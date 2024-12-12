'use client';
import Footer from '@/commons/footer';
import Header from '@/commons/header';
import { useAppContext } from '@/context/app_provider';
import { teacherStore } from '@/context/store_teacher';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Provider } from 'react-redux';

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
		<Provider store={teacherStore}>
			<section>
				<Header />
				{children}
				<Footer />
			</section>
		</Provider>
	);
}

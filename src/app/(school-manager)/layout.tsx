'use client';
import SMSidenav from '@/commons/school_manager/sidenav';
import { useAppContext } from '@/context/app_provider';
import { notFound } from 'next/navigation';
import { useEffect } from 'react';

export default function SMLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { sessionToken, userRole } = useAppContext();
	useEffect(() => {
		if (!sessionToken || userRole.toLowerCase() !== 'schoolmanager') {
			notFound();
		}
	}, [sessionToken, userRole]);

	return (
		<section className='w-screen h-fit min-h-screen flex flex-row justify-start items-start'>
			<SMSidenav />
			{children}
		</section>
	);
}

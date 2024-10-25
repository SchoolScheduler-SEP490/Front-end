'use client';
import LoadingComponent from '@/commons/loading';
import SMSidenav from '@/commons/school_manager/sidenav';
import { useAppContext } from '@/context/app_provider';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SMLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { userRole } = useAppContext();

	useEffect(() => {
		if (userRole.toLowerCase() !== 'schoolmanager') {
			notFound();
		}
	}, [userRole]);

	return (
		<section className='w-screen h-fit min-h-screen flex flex-row justify-start items-start'>
			<SMSidenav />
			{children}
		</section>
	);
}

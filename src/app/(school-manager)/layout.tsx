'use client';
import SMSidenav from '@/commons/school_manager/sidenav';
import { useAppContext } from '@/context/app_provider';
import { notFound } from 'next/navigation';
import { useEffect } from 'react';
import { IJWTTokenPayload } from '../(auth)/_utils/constants';
import { jwtDecode } from 'jwt-decode';
import { Provider } from 'react-redux';
import { schoolManagerStore } from '@/context/school_manager_store';

export default function SMLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { userRole } = useAppContext();

	if ((userRole?.toLowerCase() ?? '') !== 'schoolmanager') {
		notFound();
	}

	return (
		<section className='w-screen h-fit min-h-screen flex flex-row justify-start items-start overflow-y-hidden'>
			<SMSidenav />
			<Provider store={schoolManagerStore}>{children}</Provider>
		</section>
	);
}

'use client';
import SMSidenav from '@/commons/school_manager/sidenav';
import { useAppContext } from '@/context/app_provider';
import { notFound } from 'next/navigation';
import { useEffect } from 'react';
import { IJWTTokenPayload } from '../(auth)/_utils/constants';
import { jwtDecode } from 'jwt-decode';
import useRefreshToken from '@/hooks/useRefreshToken';

export default function SMLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { userRole, sessionToken, refreshToken } = useAppContext();
	var userData: IJWTTokenPayload = {} as IJWTTokenPayload;
	if (sessionToken) {
		userData = jwtDecode(sessionToken);
	}

	if (userRole.toLowerCase() !== 'schoolmanager') {
		notFound();
	}

	if (userData?.exp && userData.exp < Date.now() / 1000) {
		useRefreshToken({ refreshToken, userRole });
	}

	return (
		<section className='w-screen h-fit min-h-screen flex flex-row justify-start items-start overflow-y-hidden'>
			<SMSidenav />
			{children}
		</section>
	);
}

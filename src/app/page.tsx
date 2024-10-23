'use client';
import LoadingComponent from '@/commons/loading';
import { useAppContext } from '@/context/app_provider';
import { adminPaths, schoolManagerPaths, teacherPaths } from '@/utils/constants';
import { jwtDecode } from 'jwt-decode';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IJWTTokenPayload } from './(auth)/_utils/constants';

export default function Home(): JSX.Element {
	const { sessionToken } = useAppContext();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		if (sessionToken) {
			const data = jwtDecode(sessionToken ?? '');
			const userRole: string = (data as IJWTTokenPayload).role;
			switch (userRole.toLowerCase()) {
				case 'schoolmanager':
					redirect(schoolManagerPaths[0]);
				case 'admin':
					redirect(adminPaths[0]);
				case 'teacher':
					redirect(teacherPaths[0]);
				case 'teacher':
					redirect(teacherPaths[0]);
				default:
					redirect('/landing');
			}
		}
		setIsLoading(!isLoading);
	}, [sessionToken]);

	return <LoadingComponent loadingStatus={true} />;
}

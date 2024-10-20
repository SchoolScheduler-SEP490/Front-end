'use client';
import { useAppContext } from '@/context/app_provider';
import { adminPaths, schoolManagerPaths, teacherPaths } from '@/utils/constants';
import { jwtDecode } from 'jwt-decode';
import { redirect } from 'next/navigation';
import { IJWTTokenPayload } from './(auth)/_utils/constants';

export default function Home(): JSX.Element {
	const { sessionToken } = useAppContext();
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
	redirect('/landing');

	return (
		<div>
			<h1>Loading...</h1>
		</div>
	);
}

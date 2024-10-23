'use client';
import LoadingComponent from '@/commons/loading';
import { useAppContext } from '@/context/app_provider';
import { adminPaths, schoolManagerPaths, teacherPaths } from '@/utils/constants';
import { redirect } from 'next/navigation';

export default function Home(): JSX.Element {
	const { sessionToken, userRole } = useAppContext();
	if (sessionToken) {
		switch (userRole.toLowerCase()) {
			case 'schoolmanager':
				redirect(schoolManagerPaths[0]);
			case 'admin':
				redirect(adminPaths[0]);
			case 'teacher':
				redirect(teacherPaths[0]);
			case 'teacher':
				redirect(teacherPaths[0]);
			case 'không xác định':
				redirect('/landing');
			default:
				break;
		}
	}
	redirect('/landing');

	return <LoadingComponent loadingStatus={true} />;
}

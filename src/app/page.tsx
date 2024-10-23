'use client';
import LoadingComponent from '@/commons/loading';
import { useAppContext } from '@/context/app_provider';
import useNotify from '@/hooks/useNotify';
import { adminPaths, schoolManagerPaths, teacherPaths } from '@/utils/constants';
import { redirect } from 'next/navigation';
import { useMemo } from 'react';

export default function Home(): JSX.Element {
	const { sessionToken, userRole } = useAppContext();

	useMemo(() => {
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
				default:
					useNotify({
						message: 'Không thể xác thực người dùng',
						type: 'error',
					});
			}
		}
		redirect('/landing');
	}, []);

	return <LoadingComponent loadingStatus={false} />;
}

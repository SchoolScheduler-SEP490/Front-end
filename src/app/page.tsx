import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { IJWTTokenPayload } from './(auth)/_utils/constants';
import { redirect } from 'next/navigation';
import { adminPaths, schoolManagerPaths, teacherPaths } from '@/utils/constants';

export default function Home(): JSX.Element {
	const cookieStore = cookies();
	const sessionToken = cookieStore.get('sessionToken');
	if (sessionToken) {
		const data = jwtDecode(sessionToken?.value ?? '');
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

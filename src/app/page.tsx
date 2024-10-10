'use client';

import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { IJWTTokenPayload } from './(auth)/_utils/constants';
import { useEffect } from 'react';

export default function Home(): JSX.Element {
	// const cookieStore = cookies();
	// const sessionToken = cookieStore.get('sessionToken');

	// useEffect(() => {
	// 	if (sessionToken && sessionToken?.value.length !== 0) {
	// 		const data = jwtDecode(sessionToken?.value);
	// 		const userRole = (data as IJWTTokenPayload).role;

	// 		if (userRole.toLowerCase() === 'admin') {
	// 			redirect('/dashboard');
	// 		} else if (
	// 			userRole.toLowerCase() === 'teacher' ||
	// 			userRole.toLowerCase() === 'teacher_head'
	// 		) {
	// 			redirect('/published-timetable');
	// 		} else if (userRole.toLowerCase() === 'schoolManager') {
	// 			redirect('/timetable');
	// 		}
	// 	} else {
	// 		redirect('/landing');
	// 	}
	// }, []);

	redirect('/landing');

	return <div>{/* Place for redirecting based on user's session */}</div>;
}

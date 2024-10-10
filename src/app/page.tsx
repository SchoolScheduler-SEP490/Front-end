'use client';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Home(): JSX.Element {
	redirect('/landing');

	// const cookieStore = cookies();
	// const sessionToken = cookieStore.get('sessionToken');
	// const api = process.env.API_URL || '';
	// const result = await fetch(`${api}/account/me`, {
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 		Authorization: `Bearer ${sessionToken?.value}`,
	// 	},
	// }).then(async (res) => {
	// 	const payload = await res.json();
	// 	const data = {
	// 		status: res.status,
	// 		payload,
	// 	};
	// 	if (!res.ok) {
	// 		throw data;
	// 	}
	// 	return data;
	// });

	return <div>{/* Place for redirecting based on user's session */}</div>;
}

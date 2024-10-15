'use client';

import { redirect } from 'next/navigation';

export default function Home(): JSX.Element {
	redirect('/landing');

	return (
		<div>
			<h1>Loading...</h1>
		</div>
	);
}

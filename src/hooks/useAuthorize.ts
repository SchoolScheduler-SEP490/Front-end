'use client';

import { useAppContext } from '@/context/app_provider';
import { notFound } from 'next/navigation';

interface AuthorizeProps {
	role: string;
	path: string;
}

const useAuthorize = () => {
	const { sessionToken, refreshToken } = useAppContext();

	if (!sessionToken) {
		notFound();
	} else {
	}
};

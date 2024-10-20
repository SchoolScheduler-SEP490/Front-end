'use client';
import '@/commons/styles/globals.css';
import { useAppContext } from '@/context/app_provider';
import { notFound } from 'next/navigation';
import { useMemo } from 'react';

export default function TeacherLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { sessionToken, userRole } = useAppContext();
	useMemo(() => {
		if (!sessionToken || userRole.toLowerCase() !== 'teacher') {
			notFound();
		}
	}, [userRole]);

	return <section>{children}</section>;
}

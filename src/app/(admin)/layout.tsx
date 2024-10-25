'use client';
import { useAppContext } from '@/context/app_provider';
import { notFound } from 'next/navigation';
import { useMemo } from 'react';

export default function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { userRole } = useAppContext();

	useMemo(() => {
		if (userRole.toLowerCase() !== 'admin') {
			notFound();
		}
	}, [userRole]);

	return <section>{children}</section>;
}

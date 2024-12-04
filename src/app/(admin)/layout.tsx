'use client';
import AdminSidenav from '@/commons/admin/sidenav';
import { useAppContext } from '@/context/app_provider';
import { adminStore } from '@/context/store_admin';
import { notFound } from 'next/navigation';
import { Provider } from 'react-redux';

export default function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { userRole } = useAppContext();

	if ((userRole?.toLowerCase() ?? '') !== 'admin') {
		notFound();
	}

	return (
		<Provider store={adminStore}>
			<section className='w-screen h-fit min-h-screen flex flex-row justify-start items-start overflow-y-hidden'>
				<AdminSidenav />
				{children}
			</section>
		</Provider>
	);
}

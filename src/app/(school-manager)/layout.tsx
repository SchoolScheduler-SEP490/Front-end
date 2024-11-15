'use client';
import SMSidenav from '@/commons/school_manager/sidenav';
import { useAppContext } from '@/context/app_provider';
import { schoolManagerStore } from '@/context/school_manager_store';
import { notFound } from 'next/navigation';
import { Provider } from 'react-redux';

export default function SMLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { userRole } = useAppContext();

	if ((userRole?.toLowerCase() ?? '') !== 'schoolmanager') {
		notFound();
	}

	return (
		<Provider store={schoolManagerStore}>
			<section className='w-screen h-fit min-h-screen flex flex-row justify-start items-start overflow-y-hidden'>
				<SMSidenav />
				{children}
			</section>
		</Provider>
	);
}

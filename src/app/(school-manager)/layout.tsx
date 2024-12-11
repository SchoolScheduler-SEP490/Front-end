'use client';
import SMSidenav from '@/commons/school_manager/sidenav';
import { useAppContext } from '@/context/app_provider';
import { schoolManagerStore } from '@/context/store_school_manager';
import { notFound, usePathname } from 'next/navigation';
import { Provider } from 'react-redux';

export default function SMLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { userRole } = useAppContext();
	const pathname = usePathname();
	const isIframe = pathname.includes('iframe');

	if ((userRole?.toLowerCase() ?? '') !== 'schoolmanager') {
		notFound();
	}
	if (isIframe) {
		return <div className="w-full h-full">{children}</div>;
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

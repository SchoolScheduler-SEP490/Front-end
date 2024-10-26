import '@/commons/styles/globals.css';
import AppProvider from '@/context/app_provider';
import { inter } from '@/utils/fonts';
import { jwtDecode } from 'jwt-decode';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IJWTTokenPayload } from './(auth)/_utils/constants';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
	icons: ['/images/logo.png'],
	title: {
		template: 'Schedulify | %s',
		default: 'Schedulify | Trang chủ',
	},
	description: 'Hệ thống xây dựng Thời khóa biểu online',
	metadataBase: new URL('https://schedulify-se078.vercel.app'),
};
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = cookies();
	const sessionToken = cookieStore.get('sessionToken');
	const refreshToken = cookieStore.get('refreshToken');
	const userRole = cookieStore.get('userRole');

	let userData: IJWTTokenPayload = {} as IJWTTokenPayload;
	if (sessionToken) {
		userData = jwtDecode(sessionToken.value);
	}

	return (
		<html lang='vi'>
			<body
				className={`${inter.className} antialiased w-screen h-screen overflow-x-hidden scroll-smooth`}
			>
				<AppProvider
					inititalSessionToken={sessionToken?.value ?? ''}
					inititalRefreshToken={refreshToken?.value ?? ''}
					initUserRole={userRole?.value ?? ''}
					initSchoolId={userData.schoolId ?? ''}
					initSchoolName={userData.schoolName ?? ''}
				>
					{children}
				</AppProvider>
				<ToastContainer
					position='top-right'
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme='light'
					transition={Bounce}
				/>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}

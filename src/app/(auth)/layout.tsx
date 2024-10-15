import Footer from '@/commons/footer';
import Header from '@/commons/header';
import '@/commons/styles/globals.css';
import { inter } from '@/utils/fonts';
import type { Metadata } from 'next';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
	icons: ['/images/logo.png'],
	title: 'Schedulify | Trang chủ',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='vi'>
			<body className={`${inter.className} antialiased w-screen h-screen`}>
				<Header />
				{children}
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
				<Footer />
			</body>
		</html>
	);
}

import '@/commons/styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	icons: ['/images/logo.png'],
	title: 'Schedulify | Thời khóa biểu',
};

export default function TeacherLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <section>{children}</section>;
}

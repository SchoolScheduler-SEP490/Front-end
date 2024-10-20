'use client';
import useNotify from '@/hooks/useNotify';
import fetchWithToken from '@/hooks/useRefreshToken';
import { createContext, useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
const AppContext = createContext({
	sessionToken: '',
	setSessionToken: (sessionToken: string) => {},
	refreshToken: '',
	setRefreshToken: (refreshToken: string) => {},
	userRole: '',
	setUserRole: (userRole: string) => {},
});
export const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('useAppContext must be used within an AppProvider');
	}
	return context;
};
export default function AppProvider({
	children,
	inititalSessionToken = '',
	inititalRefreshToken = '',
	initUserRole = '',
}: {
	children: React.ReactNode;
	inititalSessionToken?: string;
	inititalRefreshToken?: string;
	initUserRole?: string;
}) {
	const [sessionToken, setSessionToken] = useState(inititalSessionToken);
	const [refreshToken, setRefreshToken] = useState(inititalRefreshToken);
	const [userRole, setUserRole] = useState(initUserRole);

	const { data, error } = useSWR(
		refreshToken ? ['/api/refresh', refreshToken] : null,
		([url, token]) => fetchWithToken(url, token),
		{
			revalidateOnReconnect: true,
			refreshInterval: 600000,
		}
	);

	useEffect(() => {
		if (data) {
			setSessionToken(data['jwt-token']);
			setRefreshToken(data['jwt-refresh-token']);
		}
	}, [data]);

	if (error) {
		console.error('Lỗi làm mới token: ', error);
		// Xử lý trường hợp lỗi (ví dụ: đăng xuất người dùng)
	}

	return (
		<AppContext.Provider
			value={{
				sessionToken,
				setSessionToken,
				refreshToken,
				setRefreshToken,
				userRole,
				setUserRole,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

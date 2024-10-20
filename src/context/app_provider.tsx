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
			revalidateOnFocus: false,
			revalidateOnReconnect: true,
			refreshInterval: 480000,
		}
	);

	useEffect(() => {
		if (data) {
			setSessionToken(data['jwt-token']);
			setRefreshToken(data['jwt-refresh-token']);
		}
	}, [data]);

	if (error) {
		useNotify({
			message: error.message,
			type: 'error',
		});
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

'use client';
import useNotify from '@/hooks/useNotify';
import fetchWithToken from '@/hooks/useRefreshToken';
import { createContext, useContext, useMemo, useState } from 'react';
import useSWR from 'swr';
const AppContext = createContext({
	sessionToken: '',
	setSessionToken: (sessionToken: string) => {},
	refreshToken: '',
	setRefreshToken: (refreshToken: string) => {},
	userRole: '',
	setUserRole: (userRole: string) => {},
	schoolId: '',
	setSchoolId: (schoolId: string) => {},
	schoolName: '',
	setSchoolName: (schoolName: string) => {},
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
	initSchoolId = '',
	initSchoolName = '',
}: {
	children: React.ReactNode;
	inititalSessionToken?: string;
	inititalRefreshToken?: string;
	initUserRole?: string;
	initSchoolId?: string;
	initSchoolName?: string;
}) {
	const [sessionToken, setSessionToken] = useState(inititalSessionToken);
	const [refreshToken, setRefreshToken] = useState(inititalRefreshToken);
	const [userRole, setUserRole] = useState(initUserRole);
	const [schoolId, setSchoolId] = useState(initSchoolId);
	const [schoolName, setSchoolName] = useState(initSchoolName);

	const { data, error } = useSWR(
		refreshToken.length > 0 && userRole.length > 0
			? ['/api/refresh', refreshToken]
			: null,
		([url, token]) => fetchWithToken(url, token),
		{
			revalidateOnReconnect: true,
			revalidateOnMount: true,
			revalidateOnFocus: true,
			refreshInterval: 480000,
		}
	);

	useMemo(() => {
		if (data && sessionToken.length > 0 && userRole.length > 0) {
			setSessionToken(data['jwt-token']);
			setRefreshToken(data['jwt-refresh-token']);
			setUserRole(userRole);
		} else if (userRole.length === 0 || refreshToken.length === 0) {
			fetch('/api/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ sessionToken: sessionToken }),
			}).then((res) => {
				if (res.ok) {
					setSessionToken('');
					setRefreshToken('');
					setUserRole('');
					setSchoolId('');
					setSchoolName('');
				}
			});
		}
		if (error) {
			useNotify({
				message: error.message,
				type: 'error',
			});
		}
	}, [data]);

	return (
		<AppContext.Provider
			value={{
				sessionToken,
				setSessionToken,
				refreshToken,
				setRefreshToken,
				userRole,
				setUserRole,
				schoolId,
				setSchoolId,
				schoolName,
				setSchoolName,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

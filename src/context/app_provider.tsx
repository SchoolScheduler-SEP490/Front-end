'use client';
import fetchWithToken from '@/hooks/fetchWithToken';
import useNotify from '@/hooks/useNotify';
import { useRouter } from 'next/navigation';
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
	selectedSchoolYearId: 0,
	setSelectedSchoolYearId: (selectedSchoolYearId: number) => {},
	logout: async (): Promise<any> => {},
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
	initSelectedSchoolYearId = 0,
}: {
	children: React.ReactNode;
	inititalSessionToken?: string;
	inititalRefreshToken?: string;
	initUserRole?: string;
	initSchoolId?: string;
	initSchoolName?: string;
	initSelectedSchoolYearId?: number;
}) {
	const [sessionToken, setSessionToken] = useState(inititalSessionToken);
	const [refreshToken, setRefreshToken] = useState(inititalRefreshToken);
	const [userRole, setUserRole] = useState(initUserRole);
	const [schoolId, setSchoolId] = useState(initSchoolId);
	const [schoolName, setSchoolName] = useState(initSchoolName);
	const [selectedSchoolYearId, setSelectedSchoolYearId] = useState(initSelectedSchoolYearId);
	const serverApi = process.env.NEXT_PUBLIC_NEXT_SERVER_URL ?? 'http://localhost:3000';
	const router = useRouter();

	const handleLogout = async () => {
		if (sessionToken) {
			const data = await fetch(`${serverApi}/api/logout`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ sessionToken: sessionToken ?? undefined }),
			}).then((res) => {
				if (res.ok) {
					setSessionToken('');
					setRefreshToken('');
					setUserRole('');
					setSchoolId('');
					setSchoolName('');
					setSelectedSchoolYearId(0);
				}
				return res.json();
			});
			if (data || !data) {
				router.replace('/');
				useNotify({
					message: 'Đã đăng xuất',
					type: 'success',
				});
			}
		}
	};

	const { data, error } = useSWR(
		refreshToken?.length > 0 && userRole.length > 0
			? [`${serverApi}/api/refresh`, refreshToken, userRole]
			: null,
		([url, token, userRole]) => fetchWithToken(url, token, userRole),
		{
			revalidateOnReconnect: true,
			revalidateOnMount: true,
			revalidateOnFocus: true,
			refreshInterval: 480000,
			shouldRetryOnError: false,
		}
	);

	useMemo(() => {
		if (data && sessionToken.length > 0 && userRole.length > 0) {
			setSessionToken(data['jwt-token']);
			setRefreshToken(data['jwt-refresh-token']);
			setUserRole(data.userRole);
		} else if (userRole?.length === 0) {
			if (sessionToken?.length !== 0 && refreshToken?.length !== 0) {
				handleLogout();
			}
		}
		if (error) {
			useNotify({
				message: error?.message ?? 'Lỗi không xác định',
				type: 'error',
			});
			handleLogout();
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
				selectedSchoolYearId,
				setSelectedSchoolYearId,
				logout: handleLogout,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

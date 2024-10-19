'use client';
import { createContext, useContext, useState } from 'react';
const AppContext = createContext({
	sessionToken: '',
	setSessionToken: (sessionToken: string) => {},
	refreshToken: '',
	setRefreshToken: (refreshToken: string) => {},
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
}: {
	children: React.ReactNode;
	inititalSessionToken?: string;
	inititalRefreshToken?: string;
}) {
	const [sessionToken, setSessionToken] = useState(inititalSessionToken);
	const [refreshToken, setRefreshToken] = useState(inititalRefreshToken);
	return (
		<AppContext.Provider
			value={{ sessionToken, setSessionToken, refreshToken, setRefreshToken }}
		>
			{children}
		</AppContext.Provider>
	);
}

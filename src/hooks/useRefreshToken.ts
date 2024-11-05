import useSWR from 'swr';
import fetchWithToken from './fetchWithToken';

interface IRefreshTokenProps {
	refreshToken: string;
	userRole: string;
}

const useRefreshToken = (props: IRefreshTokenProps) => {
	const serverApi = process.env.NEXT_PUBLIC_NEXT_SERVER_URL ?? 'http://localhost:3000';
	const { refreshToken, userRole } = props;

	const { data, error, mutate, isLoading, isValidating } = useSWR(
		refreshToken?.length > 0 && userRole.length > 0
			? [`${serverApi}/api/refresh`, refreshToken, userRole]
			: null,
		([url, token, userRole]) => fetchWithToken(url, token, userRole),
		{
			revalidateOnReconnect: false,
			revalidateOnMount: false,
			revalidateOnFocus: false,
			shouldRetryOnError: false,
			revalidateIfStale: false,
		}
	);
	return { data, error, mutate, isLoading, isValidating };
};

export default useRefreshToken;

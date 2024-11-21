import useSWR from 'swr';
import { getFetchClassCombinationApi } from '../_libs/apis';

interface IClassDataProps {
	sessionToken: string;
	schoolId: string;
	subjectId: number;
	schoolYearId: number;
	session: string;
	grade: string;
}
const useFetchClassCombinations = ({
	sessionToken,
	schoolId,
	subjectId,
	schoolYearId,
	session,
	grade,
}: IClassDataProps) => {
	const fetcher = async (url: string) => {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${sessionToken}`,
			},
		});
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message);
		}
		return data;
	};

	const endpoint = getFetchClassCombinationApi({
		schoolId,
		subjectId,
		schoolYearId,
		grade,
		session,
	});
	const { data, error, isValidating, isLoading, mutate } = useSWR(
		sessionToken ? endpoint : null,
		fetcher,
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: true,
			revalidateIfStale: false,
			shouldRetryOnError: false,
		}
	);
	return { data, error, isValidating, isLoading, mutate };
};
export default useFetchClassCombinations;

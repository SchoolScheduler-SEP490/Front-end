import useSWR from 'swr';
import { getFetchClassCombinationApi } from '../_libs/apis';

interface IClassDataProps {
	sessionToken: string;
	schoolId: string;
	pageSize: number;
	pageIndex: number;
	termId: number;
	classCombinationId?: number;
}
const useFetchClassCombination = ({
	sessionToken,
	schoolId,
	pageSize,
	pageIndex,
	termId,
	classCombinationId,
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
		pageIndex,
		pageSize,
		termId,
		classCombinationId,
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
export default useFetchClassCombination;

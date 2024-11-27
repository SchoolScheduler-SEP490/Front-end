import useSWR from 'swr';
import { getFetchClassCombinationApi } from '../_libs/apis';

interface IClassDataProps {
	sessionToken: string;
	schoolId: number;
	pageSize: number;
	pageIndex: number;
	termId: number;
}
const useFetchClassCombinations = ({
	sessionToken,
	schoolId,
	pageSize,
	pageIndex,
	termId,
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
		pageSize,
		pageIndex,
		termId,
	});
	const { data, error, isValidating, mutate } = useSWR(sessionToken ? endpoint : null, fetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: true,
		revalidateIfStale: true,
		shouldRetryOnError: false,
	});
	return { data, error, isValidating, mutate };
};
export default useFetchClassCombinations;
// Fix done

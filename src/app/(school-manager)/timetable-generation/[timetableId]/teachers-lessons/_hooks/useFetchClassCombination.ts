import useSWR from 'swr';
import { getFetchClassCombinationApi } from '../_libs/apis';
import { IPaginatedResponse } from '@/utils/constants';
import { IClassCombinationResponse } from '../_libs/constants';

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
		return data as IPaginatedResponse<IClassCombinationResponse>;
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
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			revalidateOnMount: false,
			shouldRetryOnError: false,
		}
	);
	return { data, error, isValidating, isLoading, mutate };
};
export default useFetchClassCombination;

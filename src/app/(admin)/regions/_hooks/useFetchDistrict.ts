import { IPaginatedResponse } from '@/utils/constants';
import useSWR from 'swr';
import { getFetchDistrictApi } from '../_libs/apis';
import { IDistrictResponse } from '../_libs/constants';

interface IFetcherProps {
	pageIndex: number;
	pageSize: number;
	provinceId: number;
}

const useFetchDistricts = (props: IFetcherProps) => {
	const { pageIndex, pageSize, provinceId } = props;
	const endpoint = getFetchDistrictApi({
		pageIndex,
		pageSize,
		provinceId,
	});

	async function fetcher(url: string) {
		const response = await fetch(url);
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message);
		}
		return data as IPaginatedResponse<IDistrictResponse>;
	}

	const { data, error, isLoading, isValidating, mutate } = useSWR(
		provinceId === 0 ? null : endpoint,
		fetcher,
		{
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			revalidateOnMount: false,
			shouldRetryOnError: false,
		}
	);

	return { data, error, isLoading, isValidating, mutate };
};

export default useFetchDistricts;

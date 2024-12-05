import { IPaginatedResponse } from '@/utils/constants';
import useSWR from 'swr';
import { getFetchProvinceApi } from '../_libs/apis';
import { IProvinceResponse } from '../_libs/constants';

interface IFetcherProps {
	pageIndex: number;
	pageSize: number;
	id?: number;
}

const useFetchProvinces = (props: IFetcherProps) => {
	const { pageIndex, pageSize, id } = props;
	const endpoint = getFetchProvinceApi({
		pageIndex,
		pageSize,
		id,
	});

	async function fetcher(url: string) {
		const response = await fetch(url, {});
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message);
		}
		return data as IPaginatedResponse<IProvinceResponse>;
	}

	const { data, error, isLoading, isValidating, mutate } = useSWR(endpoint, fetcher, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		revalidateOnMount: false,
		shouldRetryOnError: false,
	});

	return { data, error, isLoading, isValidating, mutate };
};

export default useFetchProvinces;

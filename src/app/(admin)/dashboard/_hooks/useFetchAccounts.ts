import { IPaginatedResponse } from '@/utils/constants';
import useSWR from 'swr';
import { getFetchAccountApi } from '../_libs/apis';
import { IAccountResponse } from '../_libs/constants';

interface IFetcherProps {
	sessionToken: string;
	accountStatus?: string;
	pageIndex: number;
	pageSize: number;
}

const useFetchAccounts = (props: IFetcherProps) => {
	const { sessionToken, accountStatus, pageIndex, pageSize } = props;
	const endpoint = getFetchAccountApi({
		accountStatus,
		pageIndex,
		pageSize,
	});

	async function fetcher(url: string) {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${sessionToken}`,
			},
		});
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message);
		}
		return data as IPaginatedResponse<IAccountResponse>;
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

export default useFetchAccounts;

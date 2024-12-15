import { IPaginatedResponse } from '@/utils/constants';
import useSWR from 'swr';
import { getFetchRequestsApi } from '../_libs/apis';
import { IRequestResponse } from '../_libs/constants';

interface IFetcherProps {
	sessionToken: string;
	schoolYearId: number;
	status: 'Pending' | 'Approved' | 'Rejected';
}

const useFetchRequests = (props: IFetcherProps) => {
	const { sessionToken, schoolYearId, status } = props;
	const endpoint = getFetchRequestsApi({
		schoolYearId,
		status,
	});

	async function fetcher(url: string) {
		const response = await fetch(url, {
            method: 'GET',
			headers: {
				Authorization: `Bearer ${sessionToken}`,
			},
		});
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message);
		}
		return data as IPaginatedResponse<IRequestResponse>;
	}

	const { data, error, isLoading, isValidating, mutate } = useSWR(endpoint, fetcher, {
		revalidateIfStale: false,
		revalidateOnFocus: true,
		revalidateOnReconnect: false,
		revalidateOnMount: false,
		shouldRetryOnError: false,
	});

	return { data, error, isLoading, isValidating, mutate };
};

export default useFetchRequests;

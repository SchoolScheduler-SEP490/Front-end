import useSWR from 'swr';
import { IFetchSubjectGroupBodyProps } from '../_libs/constants';
import { getFetchSubjectGroupApi } from '../_libs/apis';

const useFetchSGSidenav = (props: IFetchSubjectGroupBodyProps) => {
	const { sessionToken } = props;
	const endpoint = getFetchSubjectGroupApi(props);

	async function fetcher(url: string) {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${sessionToken}`,
			},
		});
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data);
		}
		return data;
	}

	const { data, mutate, error, isLoading, isValidating } = useSWR(endpoint, fetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		revalidateIfStale: false,
		shouldRetryOnError: false,
	});

	return { data, mutate, isLoading, isValidating, error };
};

export default useFetchSGSidenav;

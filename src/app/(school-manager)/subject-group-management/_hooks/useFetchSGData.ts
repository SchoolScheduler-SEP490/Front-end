import useSWR from 'swr';
import { IFetchSubjectGroupBodyProps } from '../_libs/constants';
import { getFetchSubjectGroupApi } from '../_libs/apis';

const useFetchSGData = (props: IFetchSubjectGroupBodyProps) => {
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

	const { data, error, isLoading, isValidating, mutate } = useSWR(endpoint, fetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: true,
		revalidateIfStale: true,
		shouldRetryOnError: false,
	});

	return { data, error, isLoading, isValidating, mutate };
};

export default useFetchSGData;

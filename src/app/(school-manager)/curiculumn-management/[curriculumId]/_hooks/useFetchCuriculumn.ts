import useSWR from 'swr';
import { IFetchCurriculumBodyProps } from '../_libs/constants';
import { getFetchCurriculumApi } from '../_libs/apis';

const useFetchCurriculumSidenav = (props: IFetchCurriculumBodyProps) => {
	const { sessionToken } = props;
	const endpoint = getFetchCurriculumApi(props);

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

export default useFetchCurriculumSidenav;

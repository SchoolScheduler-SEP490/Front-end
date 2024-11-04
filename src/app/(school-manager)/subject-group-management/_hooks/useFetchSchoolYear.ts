import useSWR from 'swr';
import { getFetchSchoolYearApi } from '../_libs/apis';

const useFetchSchoolYear = () => {
	const endpoint = getFetchSchoolYearApi();

	async function fetcher(url: string) {
		const response = await fetch(url);
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data);
		}
		return data;
	}

	const { data, error } = useSWR(endpoint, fetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: true,
		revalidateIfStale: true,
		shouldRetryOnError: false,
	});

	return { data, error };
};

export default useFetchSchoolYear;

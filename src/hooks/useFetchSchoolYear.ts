import useSWR from 'swr';

interface IFetchSchoolYearProps {
	includePrivate: boolean;
}

const useFetchSchoolYear = ({ includePrivate }: IFetchSchoolYearProps) => {
	const api = process.env.NEXT_PUBLIC_API_URL ?? 'Unknown';
	const endpoint = `${api}/api/academic-years?includePrivate=${includePrivate}`;

	async function fetcher(url: string) {
		const response = await fetch(url);
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data);
		}
		return data;
	}

	const { data, error, isValidating, isLoading, mutate } = useSWR(endpoint, fetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: true,
		revalidateIfStale: true,
		shouldRetryOnError: false,
	});

	return { data, error, isValidating, isLoading, mutate };
};

export default useFetchSchoolYear;

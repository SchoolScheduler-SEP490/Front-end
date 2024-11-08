import useSWR from 'swr';

interface IFetchTermProps {
	pageIndex: number;
	pageSize: number;
	termId?: number;
	schoolYearId: number;
}

const useFetchTerm = ({ pageIndex, pageSize, schoolYearId, termId }: IFetchTermProps) => {
	const api = process.env.NEXT_PUBLIC_API_URL ?? 'Unknown';
	const endpoint = `${api}/api/academic-years/${schoolYearId}/terms?${
		termId ? `?termId=${termId}` : ''
	}&pageIndex=${pageIndex}&pageSize=${pageSize}`;

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

export default useFetchTerm;

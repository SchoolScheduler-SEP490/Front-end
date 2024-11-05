import useSWR from 'swr';
import { getSubjectDetailApi } from '../_libs/apis';

interface IFetcherProps {
	sessionToken: string;
	subjectId: number;
}

const useFetchSubjectDetails = (props: IFetcherProps) => {
	const { sessionToken, subjectId } = props;
	const endpoint = getSubjectDetailApi({ subjectId });

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
		return data;
	}

	const { data, error, isLoading, isValidating, mutate } = useSWR(endpoint, fetcher, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		shouldRetryOnError: false,
	});

	return { data, error, isLoading, isValidating, mutate };
};

export default useFetchSubjectDetails;

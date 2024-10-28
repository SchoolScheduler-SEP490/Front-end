import useSWR from 'swr';
import { getFetchSubjectGroupApi, getFetchTermApi } from '../_libs/apis';

interface IFetchTermProps {
	sessionToken: string;
	schoolId: string;
}

const useFetchTerm = (props: IFetchTermProps) => {
	const { sessionToken, schoolId } = props;
	const endpoint = getFetchTermApi({ schoolId });

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
		return data;
	}

	const { data, error, isLoading, isValidating, mutate } = useSWR(endpoint, fetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: true,
		revalidateIfStale: true,
	});

	return { data, error, isLoading, isValidating, mutate };
};

export default useFetchTerm;

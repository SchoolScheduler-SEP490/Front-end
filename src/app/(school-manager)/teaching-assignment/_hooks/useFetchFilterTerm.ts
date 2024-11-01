import useSWR from 'swr';
import { getFetchTermApi } from '../_libs/apis';

interface IFetchTermProps {
	schoolId: string;
	sessionToken: string;
}

const useFetchTerm = (props: IFetchTermProps) => {
	const { schoolId, sessionToken } = props;
	const endpoint = getFetchTermApi({ schoolId: Number(schoolId) });

	async function fetcher(url: string) {
		const response = await fetch(url, {
			method: 'GET',
			headers: { Authorization: `Bearer ${sessionToken}` },
		});
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
	});

	return { data, error };
};

export default useFetchTerm;

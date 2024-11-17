import useSWR from 'swr';
import { getFetchSubjectOptionsApi } from '../_libs/apis';

interface ISubjectFetcherProps {
	sessionToken: string;
	schoolId: string;
	schoolYearId: number;
	pageSize: number;
	pageIndex: number;
	subjectName?: string;
	isRequired: boolean;
	deletedIncluded?: boolean;
}

const useFetchSubjectOptions = (props: ISubjectFetcherProps) => {
	const { sessionToken } = props;
	const endpoint = getFetchSubjectOptionsApi({ ...props });

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

	return { data, error, isLoading, isValidating };
};

export default useFetchSubjectOptions;

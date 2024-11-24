import useSWR from 'swr';
import { getFetchCurriculumApi } from '../_libs/apis';

interface IFetchCurriculumProps {
	sessionToken: string;
	pageSize: number;
	pageIndex: number;
	schoolId: string;
	schoolYearId: number;
	subjectGroupId?: number;
	grade?: number;
	deletedIncluded?: boolean;
}

const useFetchCurriculumInformation = (props: IFetchCurriculumProps) => {
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

	const { data, error, isLoading, isValidating, mutate } = useSWR(endpoint, fetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: true,
		revalidateIfStale: true,
		shouldRetryOnError: false,
	});

	return { data, error, isLoading, isValidating, mutate };
};

export default useFetchCurriculumInformation;
// Fix done

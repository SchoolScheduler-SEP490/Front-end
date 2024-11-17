import useSWR from 'swr';
import { getFetchCurriculumDetailApi } from '../_libs/apis';

interface IFetchCurriculumDetailProps {
	sessionToken: string;
	schoolId: number;
	schoolYearId: number;
	subjectGroupId: number;
}

const useFetchCurriculumTableData = (props: IFetchCurriculumDetailProps) => {
	const { sessionToken, subjectGroupId, schoolId, schoolYearId } = props;
	const endpoint = getFetchCurriculumDetailApi({ subjectGroupId, schoolId, schoolYearId });

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
		revalidateOnReconnect: false,
		revalidateIfStale: false,
		shouldRetryOnError: false,
	});

	return { data, error, isLoading, isValidating, mutate };
};

export default useFetchCurriculumTableData;

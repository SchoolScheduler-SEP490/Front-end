import useSWR from 'swr';
import { getFetchCurriculumDetailApi } from '../_libs/apis';

interface IFetchCurriculumDetailProps {
	sessionToken: string;
	curriculumId: number;
	schoolId: number;
	schoolYearId: number;
}

const useFetchCurriculumDetails = (props: IFetchCurriculumDetailProps) => {
	const { sessionToken, curriculumId: subjectGroupId, schoolId, schoolYearId } = props;
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

	const { data, error, mutate, isValidating } = useSWR(endpoint, fetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		revalidateIfStale: false,
		shouldRetryOnError: false,
		refreshWhenHidden: false,
		refreshWhenOffline: false,
	});

	return { data, error, mutate, isValidating };
};

export default useFetchCurriculumDetails;

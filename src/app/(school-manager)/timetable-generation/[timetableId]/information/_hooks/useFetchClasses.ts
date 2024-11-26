import useSWR from 'swr';
import { getFetchClassApi, getFetchCurriculumDetailApi } from '../_libs/apis';

interface IFetchCurriculumDetailProps {
	sessionToken: string;
	schoolId: number;
	schoolYearId: number;
	pageIndex: number;
	pageSize: number;
	grade?: string;
	includeDeleted?: boolean;
}

const useFetchClasses = (props: IFetchCurriculumDetailProps) => {
	const { sessionToken, pageIndex, pageSize, schoolId, schoolYearId, grade, includeDeleted } =
		props;
	const endpoint = getFetchClassApi({
		pageIndex,
		pageSize,
		schoolId,
		schoolYearId,
		grade,
		includeDeleted,
	});

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

export default useFetchClasses;

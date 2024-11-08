import useSWR from 'swr';
import { getFetchTeachingAssignmentApi } from '../_libs/apis';

interface IFetchTeachingAssignmentProps {
	sessionToken: string;
	schoolId: number;
	schoolYearId: number;
	termId: number;
	studentClassId: number;
}

const useFetchTeachingAssignment = (props: IFetchTeachingAssignmentProps) => {
	const { sessionToken, schoolId, schoolYearId, termId, studentClassId } = props;
	const endpoint = getFetchTeachingAssignmentApi({
		schoolId,
		schoolYearId,
		termId,
		studentClassId,
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

	const { data, error, isLoading, isValidating, mutate } = useSWR(endpoint, fetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: true,
		revalidateIfStale: true,
	});

	return { data, error, isLoading, isValidating, mutate };
};

export default useFetchTeachingAssignment;

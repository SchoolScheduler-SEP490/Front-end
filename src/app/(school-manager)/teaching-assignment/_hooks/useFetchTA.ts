import useSWR from 'swr';
import { getFetchTeachingAssignmentApi } from '../_libs/apis';

interface IFetchTeachingAssignmentProps {
	sessionToken: string;
	studentClassId: number;
	termId: number;
}

const useFetchTeachingAssignment = (props: IFetchTeachingAssignmentProps) => {
	const { sessionToken, studentClassId, termId } = props;
	const endpoint = getFetchTeachingAssignmentApi({ studentClassId, termId });

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

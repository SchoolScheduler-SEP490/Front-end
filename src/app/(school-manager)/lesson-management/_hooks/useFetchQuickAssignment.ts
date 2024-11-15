import useSWR from 'swr';
import { getQuickAssignmentApi } from '../_libs/apis';

interface IFetchQuickAssignmentProps {
	sessionToken: string;
	schoolId: number;
	schoolYearId: number;
	quickAssignmentApplied: boolean;
}

const useFetchQuickAssignment = (props: IFetchQuickAssignmentProps) => {
	const { sessionToken, schoolId, schoolYearId, quickAssignmentApplied } = props;
	const endpoint = getQuickAssignmentApi({
		schoolId,
		schoolYearId,
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

	const { data, error, isLoading, isValidating, mutate } = useSWR(
		quickAssignmentApplied ? endpoint : null,
		fetcher,
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			revalidateIfStale: false,
			shouldRetryOnError: false,
		}
	);

	return { data, error, isLoading, isValidating, mutate };
};

export default useFetchQuickAssignment;

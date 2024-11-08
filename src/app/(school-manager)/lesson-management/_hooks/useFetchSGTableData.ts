import useSWR from 'swr';
import { getFetchSubjectGroupDetailApi } from '../_libs/apis';
import { IFetchSubjectGroupBodyProps } from '../_libs/constants';

interface IFetchSubjectGroupDetailProps {
	sessionToken: string;
	schoolId: number;
	schoolYearId: number;
	subjectGroupId: number;
}

const useFetchSGTableData = (props: IFetchSubjectGroupDetailProps) => {
	const { sessionToken, subjectGroupId, schoolId, schoolYearId } = props;
	const endpoint = getFetchSubjectGroupDetailApi({ subjectGroupId, schoolId, schoolYearId });

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

export default useFetchSGTableData;

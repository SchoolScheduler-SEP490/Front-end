import useSWR from 'swr';
import { ICommonResponse } from '@/utils/constants';
import { ITeachableTeacherResponse } from '../_libs/constants';
import { getTeachableTeachersApi } from '../_libs/apis';
import { CLASSGROUP_TRANSLATOR_REVERSED } from '@/utils/constants';

interface IFetcherProps {
	sessionToken: string;
	schoolId: number;
	subjectId: number;
	grade?: number;
}

const useFetchTeachableTeacher = (props: IFetcherProps) => {
	const { sessionToken, schoolId, subjectId, grade } = props;
	const endpoint = getTeachableTeachersApi({
		schoolId,
		subjectId,
		grade: grade ? CLASSGROUP_TRANSLATOR_REVERSED[grade] : undefined,
	});

	async function fetcher(url: string) {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${sessionToken}`,
			},
		});
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message);
		}
		return data as ICommonResponse<ITeachableTeacherResponse[]>;
	}

	const { data, error, isLoading, isValidating, mutate } = useSWR(endpoint, fetcher, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		revalidateOnMount: false,
		shouldRetryOnError: false,
	});

	return { data, error, isLoading, isValidating, mutate };
};

export default useFetchTeachableTeacher;

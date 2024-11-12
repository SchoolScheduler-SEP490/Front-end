import useSWR from 'swr';
import { getFetchSubjectApi } from '../_libs/apis';
import { getFetchTeachableTeacherApi } from '../../teaching-assignment/_libs/apis';
import { ICommonResponse } from '@/utils/constants';
import { ITeachableTeacherResponse } from '../_libs/constants';

interface IFetcherProps {
	sessionToken: string;
	schoolId: number;
	subjectId: number;
}

const useFetchTeachableTeacher = (props: IFetcherProps) => {
	const { sessionToken, schoolId, subjectId } = props;
	const endpoint = getFetchTeachableTeacherApi({
		schoolId,
		subjectId,
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

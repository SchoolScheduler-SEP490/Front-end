import useSWR from 'swr';
import { getFetchTeachableTeacherApi } from '../_libs/apis';

interface IFetchTeachableTeacherProps {
	schoolId: number;
	subjectId: number;
	sessionToken: string;
	grade: string;
}
const useFetchTeachableTeacher = (props: IFetchTeachableTeacherProps) => {
	const { schoolId, subjectId, sessionToken, grade } = props;
	const endpoint = getFetchTeachableTeacherApi({ schoolId, subjectId, grade });

	async function fetcher(url: string) {
		const response = await fetch(url, {
			method: 'GET',
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

	const { data, error, mutate } = useSWR(subjectId === 0 ? null : endpoint, fetcher, {
		revalidateOnFocus: false,
		errorRetryInterval: 10000000000,
		revalidateOnReconnect: false,
		revalidateIfStale: false,
		errorRetryCount: 2,
		onErrorRetry: () => {},
	});

	return { data, mutate };
};

export default useFetchTeachableTeacher;

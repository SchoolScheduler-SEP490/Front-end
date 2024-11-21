import useSWR from 'swr';
import { getTeachableTeachersBySubjectApi } from '../_libs/apis';

interface IClassDataProps {
	sessionToken: string;
	schoolId: number;
	subjectId: number;
	grade?: string;
}
const useFetchTeachableTeachers = ({
	sessionToken,
	schoolId,
	subjectId,
	grade,
}: IClassDataProps) => {
	const fetcher = async (url: string) => {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${sessionToken}`,
			},
		});
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message);
		}
		return data;
	};

	const endpoint = getTeachableTeachersBySubjectApi({
		schoolId,
		subjectId,
		grade,
	});
	const { data, error, isValidating, isLoading, mutate } = useSWR(
		sessionToken || subjectId != 0 ? endpoint : null,
		fetcher,
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: true,
			revalidateIfStale: false,
			shouldRetryOnError: false,
		}
	);
	return { data, error, isValidating, isLoading, mutate };
};
export default useFetchTeachableTeachers;

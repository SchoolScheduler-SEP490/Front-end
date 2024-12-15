import useSWR from 'swr';
import { getFetchTeacherApi } from '../_libs/apis';

interface IClassDataProps {
	sessionToken: string;
	schoolId: string;
	pageSize: number;
	pageIndex: number;
	includeDeleted?: boolean;
}
const useFetchTeachers = ({
	sessionToken,
	schoolId,
	pageSize,
	pageIndex,
	includeDeleted,
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

	const endpoint = getFetchTeacherApi({
		schoolId,
		pageIndex,
		pageSize,
		includeDeleted,
	});
	const { data, error, isValidating, isLoading, mutate } = useSWR(
		sessionToken ? endpoint : null,
		fetcher,
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: true,
			revalidateIfStale: true,
		}
	);
	return { data, error, isValidating, isLoading, mutate };
};
export default useFetchTeachers;

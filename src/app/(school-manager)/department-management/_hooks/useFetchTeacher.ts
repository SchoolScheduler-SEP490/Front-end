import useSWR from 'swr';
import { getFetchTeacherApi } from '../_libs/apis';
import { IPaginatedResponse } from '@/utils/constants';
import { ITeacherResponse } from '../_libs/constants';

interface IClassDataProps {
	sessionToken: string;
	schoolId: string;
	pageSize: number;
	pageIndex: number;
	includeDeleted?: boolean;
	departmentId?: number;
}
const useFetchTeacher = ({
	sessionToken,
	schoolId,
	pageSize,
	pageIndex,
	includeDeleted,
	departmentId,
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
		return data as IPaginatedResponse<ITeacherResponse>;
	};

	const endpoint = getFetchTeacherApi({
		schoolId,
		pageIndex,
		pageSize,
		includeDeleted,
		departmentId,
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
export default useFetchTeacher;

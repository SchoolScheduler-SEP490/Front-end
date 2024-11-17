import useSWR from 'swr';
import { getFetchDepartmentApi } from '../_libs/apis';
import { IPaginatedResponse } from '@/utils/constants';
import { IDepartmentResponse } from '../_libs/constants';

interface IFetchCurriculumDetailProps {
	sessionToken: string;
	schoolId: number;
	pageIndex: number;
	pageSize: number;
}

const useFetchDepartment = (props: IFetchCurriculumDetailProps) => {
	const { sessionToken, pageIndex, pageSize, schoolId } = props;
	const endpoint = getFetchDepartmentApi({ schoolId, pageIndex, pageSize });

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
		return data as IPaginatedResponse<IDepartmentResponse>;
	}

	const { data, error, isLoading, isValidating, mutate } = useSWR(endpoint, fetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		revalidateIfStale: false,
		shouldRetryOnError: false,
	});

	return { data, error, isLoading, isValidating, mutate };
};

export default useFetchDepartment;

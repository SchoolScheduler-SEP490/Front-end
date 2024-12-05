import { IPaginatedResponse } from '@/utils/constants';
import useSWR from 'swr';
import { getFetchSchoolApi } from '../_libs/apis';
import { ISchoolResponse } from '../_libs/constants';

interface IFetcherProps {
	sessionToken: string;
	pageIndex: number;
	pageSize: number;
	schoolStatus?: string;
	districtCode?: number;
	provinceId?: number;
}

const useFetchSchools = (props: IFetcherProps) => {
	const { sessionToken, pageIndex, pageSize, districtCode, provinceId, schoolStatus } = props;
	const endpoint = getFetchSchoolApi({
		pageIndex,
		pageSize,
		districtCode,
		provinceId,
		schoolStatus,
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
		return data as IPaginatedResponse<ISchoolResponse>;
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

export default useFetchSchools;

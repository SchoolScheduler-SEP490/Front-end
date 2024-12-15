import useSWR from 'swr';
import { getFetchClassGroupApi } from '../_libs/apis';

interface IClassGroupDataProps {
	sessionToken: string;
	schoolId: number;
	pageSize: number;
	pageIndex: number;
	schoolYearId: number;
}

const useFetchClassGroupInformation = ({
	sessionToken,
	schoolId,
	pageSize,
	pageIndex,
	schoolYearId,
}: IClassGroupDataProps) => {
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

	const endpoint = getFetchClassGroupApi({
		pageIndex,
		pageSize,
		schoolId,
		schoolYearId,
	});

	const { data, error, isValidating, mutate } = useSWR(sessionToken ? endpoint : null, fetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: true,
		revalidateIfStale: true,
		shouldRetryOnError: false,
	});
	return { data, error, isValidating, mutate };
};

export default useFetchClassGroupInformation;

import useSWR from 'swr';
import { getFetchClassApi } from '../_libs/apis';

interface IClassDataProps {
	sessionToken: string;
	schoolId: string;
	pageSize: number;
	pageIndex: number;
	schoolYearId: number;
	grade: string;
}
const useFetchSGClass = ({
	sessionToken,
	schoolId,
	pageSize,
	pageIndex,
	schoolYearId,
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

	const endpoint = getFetchClassApi({
		schoolId,
		pageSize,
		pageIndex,
		includeDeleted: false,
		schoolYearId,
		grade,
	});
	const { data, error, isValidating, mutate } = useSWR(sessionToken ? endpoint : null, fetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: true,
		revalidateIfStale: true,
		shouldRetryOnError: false,
	});
	return { data, error, isValidating, mutate };
};
export default useFetchSGClass;
// Fix done

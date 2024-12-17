import { IPaginatedResponse } from '@/utils/constants';
import useSWR from 'swr';
import { getFetchTeacherAccountsApi } from '../_libs/apiTeacher';
import { ITeacherAccountResponse } from '../_libs/constants';

interface IFetcherProps {
	sessionToken: string;
	schoolId: number;
}

const useFetchTeacherAccounts = (props: IFetcherProps) => {
	const { sessionToken, schoolId } = props;
	const endpoint = getFetchTeacherAccountsApi(schoolId);

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
		return data as IPaginatedResponse<ITeacherAccountResponse>;
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

export default useFetchTeacherAccounts;

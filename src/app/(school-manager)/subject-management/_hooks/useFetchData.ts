import useSWR from 'swr';
import { getFetchSubjectApi } from '../_libs/apis';
import { revalidateEvents } from 'swr/_internal';
import useNotify from '@/hooks/useNotify';
import { TRANSLATOR } from '@/utils/dictionary';

interface IFetcherProps {
	sessionToken: string;
	schoolId: string;
	pageSize: number;
	pageIndex: number;
	subjectName?: string;
	isRequired?: boolean;
	deletedIncluded?: boolean;
}

const useFetchData = (props: IFetcherProps) => {
	const {
		sessionToken,
		schoolId,
		pageSize,
		pageIndex,
		subjectName,
		isRequired,
		deletedIncluded,
	} = props;
	const endpoint = getFetchSubjectApi({
		schoolId,
		pageSize,
		pageIndex,
		subjectName,
		isRequired,
		deletedIncluded,
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
		return data;
	}

	const { data, error, isLoading, isValidating, mutate } = useSWR(endpoint, fetcher, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		shouldRetryOnError: false,
	});

	return { data, error, isLoading, isValidating, mutate };
};

export default useFetchData;

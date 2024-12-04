import useSWR from 'swr';
import { getFetchSubjectApi } from '../_libs/apis';
import { revalidateEvents } from 'swr/_internal';
import useNotify from '@/hooks/useNotify';
import { TRANSLATOR } from '@/utils/dictionary';

interface IFetcherProps {
	sessionToken: string;
	schoolYearId: number;
	localApi?: string;
	pageIndex: number;
	pageSize: number;
	id?: number;
	subjectName?: string;
	isRequired?: boolean;
	deletedIncluded?: boolean;
}

const useFetchData = (props: IFetcherProps) => {
	const {
		sessionToken,
		pageSize,
		pageIndex,
		schoolYearId,
		deletedIncluded,
		id,
		isRequired,
		localApi,
		subjectName,
	} = props;
	const endpoint = getFetchSubjectApi({
		pageSize,
		pageIndex,
		schoolYearId,
		deletedIncluded,
		id,
		isRequired,
		localApi,
		subjectName,
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

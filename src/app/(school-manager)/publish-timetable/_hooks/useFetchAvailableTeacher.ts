import { ICommonResponse } from '@/utils/constants';
import useSWR from 'swr';
import { getFetchAvailableTeacherApi } from '../_libs/apiPublish';
import { IAvailableTeacherResponse } from '../_libs/constants';

interface IFetcherProps {
	sessionToken: string;
	schoolId: number;
	yearId: number;
	termId: number;
	classPeriodId: number;
	day: string;
	slot: number;
}

const useFetchAvailableTeachers = (props: IFetcherProps) => {
	const { sessionToken, schoolId, termId, classPeriodId, day, slot, yearId } = props;
	const endpoint = getFetchAvailableTeacherApi({
		classPeriodId,
		day,
		schoolId,
		slot,
		termId,
		yearId,
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

	const { data, error, isLoading, isValidating, mutate } = useSWR(
		endpoint,
		fetcher,
		{
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			revalidateOnMount: false,
			shouldRetryOnError: false,
		}
	);

	return { data, error, isLoading, isValidating, mutate };
};

export default useFetchAvailableTeachers;

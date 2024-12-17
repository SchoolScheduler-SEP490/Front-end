import useSWR from 'swr';
import { getFetchWeekDaysApi } from '../_libs/apis';
import { ICommonResponse } from '@/utils/constants';
import { IWeekdayResponse } from '../_libs/constants';

interface IFetcherProps {
	sessionToken: string;
	termId: number;
	weekNumber?: number;
	schoolId: number;
	yearId: number;
}

const useFetchWeekDays = (props: IFetcherProps) => {
	const { sessionToken, schoolId, termId, weekNumber, yearId } = props;
	const endpoint = getFetchWeekDaysApi({
		schoolId,
		termId,
		weekNumber,
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
		return data as ICommonResponse<IWeekdayResponse[]>;
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

export default useFetchWeekDays;

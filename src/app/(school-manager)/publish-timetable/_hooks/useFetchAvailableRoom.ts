import { ICommonResponse } from '@/utils/constants';
import useSWR from 'swr';
import { getFetchAvailableRoomApi } from '../_libs/apiPublish';
import { IAvailableRoomResponse } from '../_libs/constants';

interface IFetcherProps {
	sessionToken: string;
	schoolId: number;
	yearId: number;
	termId: number;
	classPeriodId: number;
	day: string;
	slot: number;
}

const useFetchAvailableRooms = (props: IFetcherProps) => {
	const { sessionToken, schoolId, yearId, classPeriodId,day,slot,termId } = props;
	const endpoint = getFetchAvailableRoomApi({
		classPeriodId,
		day,
		schoolId,
		slot,
		termId,
		yearId,
	});

	async function fetcher(url: string) {
		const response = await fetch(url, {
            method: 'GET',
			headers: {
				Authorization: `Bearer ${sessionToken}`,
			},
		});
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message);
		}
		return data ;
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

export default useFetchAvailableRooms;

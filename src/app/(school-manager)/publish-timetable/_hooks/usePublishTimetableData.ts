import { ICommonResponse, IScheduleResponse } from '@/utils/constants';
import useSWR from 'swr';

interface IPublishTimetableDataProps {
	schoolId: string;
	schoolYearId: number;
	termId: number;
	sessionToken: string;
	date: Date;
}

const api = process.env.NEXT_PUBLIC_API_URL;

const usePublishTimetableData = ({
	schoolId,
	schoolYearId,
	termId,
	sessionToken,
	date,
}: IPublishTimetableDataProps) => {
	const formattedDate = date.toISOString().split('T')[0];
	const endpoint = `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/timetables/${formattedDate}?termId=${termId}`;

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
		revalidateOnMount: false,
		shouldRetryOnError: false,
	});

	return { data, error, isLoading, isValidating, mutate };
};

export default usePublishTimetableData;

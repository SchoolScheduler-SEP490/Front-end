import { ICommonResponse } from '@/utils/constants';
import { headers } from 'next/headers';
import { ITeachingAssignmentAvailabilityResponse } from '../_libs/constants';
import { getCheckAutoAssignAvailabilityApi } from '../_libs/apis';
import useSWR from 'swr';

interface IAvailabilityCheckProps {
	sessionToken: string;
	schoolYearId: number;
	schoolId: number;
}

const useCheckAutoAssignAvailability = ({
	sessionToken,
	schoolYearId,
	schoolId,
}: IAvailabilityCheckProps) => {
	const fetcher = async (url: string) => {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${sessionToken}`,
			},
		});

		const data = await response.json();
		return data;
	};

	const endpoint = getCheckAutoAssignAvailabilityApi({ schoolId, schoolYearId });

	const { data, error, isValidating, isLoading, mutate } = useSWR(
		sessionToken ? endpoint : null,
		fetcher,
		{
			revalidateOnFocus: true,
			revalidateOnReconnect: true,
			revalidateIfStale: false,
			shouldRetryOnError: false,
		}
	);

	return { data, error, isValidating, isLoading, mutate };
};

export default useCheckAutoAssignAvailability;

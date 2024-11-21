import { ICommonResponse } from '@/utils/constants';
import { headers } from 'next/headers';
import {
	IAutoTeacherAssingmentRequest,
	ITeachingAssignmentAvailabilityResponse,
} from '../_libs/constants';
import { getCheckAutoAssignAvailabilityApi } from '../_libs/apis';
import useSWR from 'swr';

interface IAvailabilityCheckProps {
	sessionToken: string;
	schoolYearId: number;
	schoolId: number;
	revalidate: boolean;
	body: IAutoTeacherAssingmentRequest;
}

const useCheckAutoAssignAvailability = ({
	sessionToken,
	schoolYearId,
	schoolId,
	revalidate,
	body,
}: IAvailabilityCheckProps) => {
	const fetcher = async (url: string) => {
		const response = await fetch(url, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${sessionToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});

		const data = await response.json();
		return data;
	};

	const endpoint = getCheckAutoAssignAvailabilityApi({ schoolId, schoolYearId });

	const { data, error, isValidating, isLoading, mutate } = useSWR(
		sessionToken ? endpoint : null,
		fetcher,
		{
			revalidateOnFocus: revalidate,
			revalidateOnReconnect: true,
			revalidateIfStale: false,
			shouldRetryOnError: false,
		}
	);

	return { data, error, isValidating, isLoading, mutate };
};

export default useCheckAutoAssignAvailability;

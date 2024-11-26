import { WEEK_DAYS, WEEK_DAYS_FULL } from '@/utils/constants';

const useGetSlotDetails = (slotId: number, shorten: boolean): string => {
	const result: string = `${WEEK_DAYS_FULL[Math.floor((slotId - 1) / 10)]} - Tiết ${
		((slotId - 1) % 10) + 1
	}`;

	const shortenedResult = `${WEEK_DAYS[Math.floor((slotId - 1) / 10)]}-S.${
		((slotId - 1) % 10) + 1
	}`;

	return shorten ? shortenedResult : result;
};

export default useGetSlotDetails;

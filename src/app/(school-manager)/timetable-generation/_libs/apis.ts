const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getFetchClassCombinationApi = ({
	pageIndex,
	pageSize,
	schoolId,
	termId,
}: {
	schoolId: number;
	termId: number;
	pageIndex: number;
	pageSize: number;
}) => {
	return `${api}/api/room-subjects?schoolId=${schoolId}&termId=${termId}&pageIndex=${pageIndex}&pageSize=${pageSize}`;
};

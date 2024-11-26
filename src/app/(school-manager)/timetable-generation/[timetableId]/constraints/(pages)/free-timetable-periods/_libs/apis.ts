const api = process.env.NEXT_PUBLIC_API_URL || 'Unknown';

export const getFetchClassApi = ({
	localApi,
	schoolId,
	schoolYearId,
	includeDeleted,
	pageIndex,
	pageSize,
	grade,
}: {
	localApi?: string;
	schoolId: string;
	schoolYearId: number;
	includeDeleted: boolean;
	pageIndex: number;
	pageSize: number;
	grade: string;
}) => {
	const queryString = new URLSearchParams({
		pageSize: pageSize ? pageSize.toString() : '1000',
		pageIndex: pageIndex ? pageIndex.toString() : '1',
		includeDeleted: includeDeleted.toString(),
		grade: grade,
	}).toString();

	return `${
		localApi ?? api
	}/api/schools/${schoolId}/academic-years/${schoolYearId}/classes?${queryString}`;
};

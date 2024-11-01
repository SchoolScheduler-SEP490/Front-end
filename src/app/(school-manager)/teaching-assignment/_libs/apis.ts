const api = process.env.NEXT_PUBLIC_API_URL || 'Unknown';

export const getFetchClassApi = ({
	localApi,
	schoolId,
	pageIndex,
	pageSize,
	schoolYearId,
	includedDeleted,
}: {
	localApi?: string;
	schoolId: string;
	pageIndex: number;
	pageSize: number;
	schoolYearId: number;
	includedDeleted?: boolean;
}) => {
	const queryString = new URLSearchParams({
		schoolId: schoolId.toString(),
		pageSize: pageSize.toString(),
		pageIndex: pageIndex.toString(),
		schoolYearId: schoolYearId.toString(),
		includedDeleted: includedDeleted ? includedDeleted.toString() : 'false',
	}).toString();

	return `${localApi ?? api}/api/student-classes?${queryString}`;
};

export const getFetchTermApi = ({
	localApi,
	schoolId,
}: {
	localApi?: string;
	schoolId: number;
}) => {
	return `${localApi ?? api}/api/terms/${schoolId}`;
};

export const getFetchSchoolYearApi = (localApi?: string) => {
	return `${localApi ?? api}/api/school-years`;
};

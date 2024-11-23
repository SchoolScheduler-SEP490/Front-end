const api = process.env.NEXT_PUBLIC_API_URL || 'Unknown';

export const getFetchClassApi = ({
	localApi,
	schoolId,
	schoolYearId,
	pageIndex,
	pageSize,
	grade,
	includedDeleted,
}: {
	localApi?: string;
	schoolId: string;
	schoolYearId: number;
	pageIndex: number;
	pageSize: number;
	grade?: number;
	includedDeleted?: boolean;
}) => {
	const queryString = new URLSearchParams({
		pageSize: pageSize.toString(),
		pageIndex: pageIndex.toString(),
		grade: grade ? grade.toString() : '',
		includedDeleted: includedDeleted ? includedDeleted.toString() : 'false',
	}).toString();

	return `${
		localApi ?? api
	}/api/schools/${schoolId}/academic-years/${schoolYearId}/classes?${queryString}`;
};

export const getFetchTeacherApi = ({
	localApi,
	schoolId,
	pageIndex,
	pageSize,
	includeDeleted,
}: {
	localApi?: string;
	schoolId: string;
	pageIndex: number;
	pageSize: number;
	includeDeleted?: boolean;
}) => {
	const queryString = new URLSearchParams({
		pageSize: pageSize.toString(),
		pageIndex: pageIndex.toString(),
		includedDeleted: includeDeleted ? includeDeleted.toString() : 'false',
	}).toString();
	return `${localApi ?? api}/api/schools/${schoolId}/teachers?${queryString}`;
};

// Fetch Subject API
export const getFetchSubjectApi = ({
	localApi,
	schoolYearId,
	pageSize,
	pageIndex,
	subjectName,
	isRequired,
	deletedIncluded,
}: {
	localApi?: string;
	schoolYearId: number;
	pageSize: number;
	pageIndex: number;
	subjectName?: string;
	isRequired?: boolean;
	deletedIncluded?: boolean;
}): string => {
	const queryString = new URLSearchParams({
		schoolYearIdint: schoolYearId.toString(),
		pageSize: pageSize.toString(),
		pageIndex: pageIndex.toString(),
		...(subjectName && { subjectName: subjectName }),
		...(isRequired !== undefined && { isRequired: isRequired.toString() }),
		...(deletedIncluded !== undefined && {
			includeDeleted: deletedIncluded.toString(),
		}),
	}).toString();
	return `${localApi ?? api}/api/subjects?${queryString}`;
};

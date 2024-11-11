const api = process.env.NEXT_PUBLIC_API_URL;

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

export const getSubjectDetailApi = ({
	localApi,
	subjectId,
}: {
	localApi?: string;
	subjectId: number;
}) => {
	return `${localApi ?? api}/api/subjects/${subjectId}`;
};

export const getTeachableTeachersApi = ({
	localApi,
	schoolId,
	subjectId,
}: {
	localApi?: string;
	schoolId: number;
	subjectId: number;
}) => {
	return `${localApi ?? api}/api/schools/${schoolId}/subjects/${subjectId}/teachable-subjects`;
};

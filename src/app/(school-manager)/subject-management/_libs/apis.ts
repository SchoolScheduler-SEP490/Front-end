const api = process.env.NEXT_PUBLIC_API_URL;

// Create Subject API
export const getCreateSubjectApi = ({
	localApi,
	schoolId,
}: {
	localApi?: string;
	schoolId: string;
}): string => {
	return `${localApi ?? api}/api/subjects/${schoolId}/subjects`;
};

// Fetch Subject API
export const getFetchSubjectApi = ({
	localApi,
	schoolId,
	pageSize,
	pageIndex,
	subjectName,
	isRequired,
	deletedIncluded,
}: {
	localApi?: string;
	schoolId: string;
	pageSize: number;
	pageIndex: number;
	subjectName?: string;
	isRequired?: boolean;
	deletedIncluded?: boolean;
}): string => {
	const queryString = new URLSearchParams({
		pageSize: pageSize.toString(),
		pageIndex: pageIndex.toString(),
		...(subjectName && { subjectName: subjectName }),
		...(isRequired !== undefined && { isRequired: isRequired.toString() }),
		...(deletedIncluded !== undefined && {
			includeDeleted: deletedIncluded.toString(),
		}),
	}).toString();
	return `${localApi ?? api}/api/subjects/${schoolId}/subjects?${queryString}`;
};

// Update Subject API
export const getUpdateSubjectApi = ({
	localApi,
	subjectId,
}: {
	localApi?: string;
	subjectId: number;
}): string => {
	return `${localApi ?? api}/api/subjects/${subjectId}`;
};

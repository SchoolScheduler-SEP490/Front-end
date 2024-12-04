const api = process.env.NEXT_PUBLIC_API_URL;

// Create Subject API
export const getCreateSubjectApi = ({
	localApi,
	schoolYearId,
}: {
	localApi?: string;
	schoolYearId: number;
}): string => {
	return `${localApi ?? api}/api/subjects?schoolYearId=${schoolYearId}`;
};

// Fetch Subject API
export const getFetchSubjectApi = ({
	schoolYearId,
	localApi,
	pageSize,
	pageIndex,
	id,
	subjectName,
	isRequired,
	deletedIncluded,
}: {
	schoolYearId: number;
	localApi?: string;
	pageIndex: number;
	pageSize: number;
	id?: number;
	subjectName?: string;
	isRequired?: boolean;
	deletedIncluded?: boolean;
}): string => {
	const queryString = new URLSearchParams({
		schoolYearIdint: schoolYearId.toString(),
		...(id && { id: id.toString() }),
		...(subjectName && { subjectName: subjectName }),
		...(deletedIncluded !== undefined && {
			includeDeleted: deletedIncluded.toString(),
		}),
		pageSize: pageSize.toString(),
		pageIndex: pageIndex.toString(),
		...(isRequired !== undefined && { isRequired: isRequired.toString() }),
	}).toString();
	return `${localApi ?? api}/api/subjects?${queryString}`;
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

export const getSubjectDetailApi = ({
	localApi,
	subjectId,
}: {
	localApi?: string;
	subjectId: number;
}) => {
	return `${localApi ?? api}/api/subjects/${subjectId}`;
};

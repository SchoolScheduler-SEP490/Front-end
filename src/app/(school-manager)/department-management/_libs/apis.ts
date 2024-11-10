const api = process.env.NEXT_PUBLIC_API_URL;

export const getFetchDepartmentApi = ({
	localApi,
	schoolId,
	pageIndex,
	pageSize,
}: {
	localApi?: string;
	schoolId: number;
	pageIndex: number;
	pageSize: number;
}) => {
	return `${
		localApi ?? api
	}/api/schools/${schoolId}/departments?pageIndex=${pageIndex}&pageSize=${pageSize}`;
};

export const getCreateDepartmentApi = ({ schoolId }: { schoolId: number }) => {
	return `${api}/api/schools/${schoolId}/departments`;
};

export const getUpdateDepartmentApi = ({
	schoolId,
	departmentId,
}: {
	schoolId: number;
	departmentId: number;
}) => {
	return `${api}/api/schools/${schoolId}/departments/${departmentId}`;
};

export const getDeleteDepartmentApi = ({
	schoolId,
	departmentId,
}: {
	schoolId: number;
	departmentId: number;
}) => {
	return `${api}/api/schools/${schoolId}/departments/${departmentId}`;
};

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

const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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

export const getFetchStudentClassApi = ({
	pageIndex,
	pageSize,
	schoolId,
	yearId,
	grade,
	includeDeleted,
}: {
	schoolId: number;
	yearId: number;
	grade?: string;
	includeDeleted?: boolean;
	pageIndex: number;
	pageSize: number;
}) => {
	const queryString = new URLSearchParams({
		pageIndex: pageIndex.toString(),
		pageSize: pageSize.toString(),
		...(grade !== undefined && { grade: grade.toString() }),
		includeDeleted: includeDeleted ? includeDeleted.toString() : 'false',
	}).toString();
	return `${api}/api/schools/${schoolId}/academic-years/${yearId}/classes?${queryString}`;
};

export const getFetchCurriculumApi = (props: {
	sessionToken: string;
	pageSize: number;
	pageIndex: number;
	schoolId: string;
	schoolYearId: number;
	subjectGroupId?: number;
	grade?: number;
	deletedIncluded?: boolean;
}) => {
	const { pageIndex, pageSize, schoolId, schoolYearId, grade, subjectGroupId, deletedIncluded } =
		props;
	const queryString = new URLSearchParams({
		pageSize: pageSize.toString(),
		pageIndex: pageIndex.toString(),
		...(grade !== undefined && { grade: grade.toString() }),
		...(subjectGroupId !== undefined && {
			subjectGroupId: subjectGroupId.toString(),
		}),
		...(deletedIncluded !== undefined && {
			includeDeleted: deletedIncluded.toString(),
		}),
	}).toString();
	return `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/curriculum?${queryString}`;
};

export const getFetchCurriculumDetailApi = ({
	localApi,
	subjectGroupId,
	schoolId,
	schoolYearId,
}: {
	localApi?: string;
	subjectGroupId: number;
	schoolId: number;
	schoolYearId: number;
}) => {
	return `${
		localApi ?? api
	}/api/schools/${schoolId}/academic-years/${schoolYearId}/curriculum/${subjectGroupId}`;
};

export const getFetchClassGroupApi = ({
	pageIndex,
	pageSize,
	schoolId,
	schoolYearId,
}: {
	schoolId: number;
	schoolYearId: number;
	pageIndex: number;
	pageSize: number;
}) => {
	return `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/class-groups?pageIndex=${pageIndex}&pageSize=${pageSize}`;
};

export const getFetchClassApi = ({
	pageIndex,
	pageSize,
	schoolId,
	schoolYearId,
	grade,
	includeDeleted,
}: {
	schoolId: number;
	schoolYearId: number;
	pageIndex: number;
	pageSize: number;
	grade?: string;
	includeDeleted?: boolean;
}) => {
	const queryString = new URLSearchParams({
		pageSize: pageSize.toString(),
		pageIndex: pageIndex.toString(),
		...(grade !== undefined && { grade: grade.toString() }),
		...(includeDeleted !== undefined && {
			includeDeleted: includeDeleted.toString(),
		}),
	}).toString();
	return `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/classes?${queryString}`;
};

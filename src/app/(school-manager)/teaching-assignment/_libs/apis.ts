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

export const getFetchTeachingAssignmentApi = ({
	localApi,
	studentClassId,
	termId,
}: {
	localApi?: string;
	studentClassId: number;
	termId: number;
}) => {
	const queryString = new URLSearchParams({
		studentClassId: studentClassId.toString(),
		termId: termId.toString(),
	}).toString();

	return `${localApi ?? api}/api/teacher-assignments?${queryString}`;
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
		schoolId: schoolId.toString(),
		pageSize: pageSize.toString(),
		pageIndex: pageIndex.toString(),
		includedDeleted: includeDeleted ? includeDeleted.toString() : 'false',
	}).toString();
	return `${localApi ?? api}/api/teachers?${queryString}`;
};

export const getAssignTeacherApi = (localApi?: string) => {
	return `${localApi ?? api}/api/teacher-assignments`;
};

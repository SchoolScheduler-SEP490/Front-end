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

export const getAssignTeacherApi = ({
	localApi,
	schoolId,
	schoolYearId,
}: {
	localApi?: string;
	schoolId: number;
	schoolYearId: number;
}) => {
	return `${
		localApi ?? api
	}/api/schools/${schoolId}/academic-years/${schoolYearId}/teacher-assignments`;
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

export const getFetchTeachingAssignmentApi = ({
	schoolId,
	schoolYearId,
	termId,
	studentClassId,
}: {
	schoolId: number;
	schoolYearId: number;
	termId: number;
	studentClassId: number;
}) => {
	const queryString = new URLSearchParams({
		studentClassId: studentClassId.toString(),
		termId: termId.toString(),
	}).toString();
	return `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/teacher-assignments?${queryString}`;
};

export const getFetchTeachableTeacherApi = ({
	localApi,
	schoolId,
	subjectId,
	grade,
}: {
	localApi?: string;
	schoolId: number;
	subjectId: number;
	grade: string;
}) => {
	return `${
		localApi ?? api
	}/api/schools/${schoolId}/subjects/${subjectId}/teachable-subjects?eGrade=${grade}`;
};

export const getCheckAutoAssignAvailabilityApi = ({
	schoolId,
	schoolYearId,
}: {
	schoolId: number;
	schoolYearId: number;
}) => {
	return `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/teacher-assignments/check-auto-assign-teacher`;
};

export const getAutoAssignmentApi = ({
	schoolId,
	schoolYearId,
}: {
	schoolId: number;
	schoolYearId: number;
}) => {
	return `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/teacher-assignments/auto-assign-teacher`;
};

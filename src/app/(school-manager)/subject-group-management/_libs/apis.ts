import { IFetchSubjectGroupBodyProps } from './constants';

const api = process.env.NEXT_PUBLIC_API_URL;

// Fetch Subject Group API
interface IFetchSubjectGroupBodyApiProps extends IFetchSubjectGroupBodyProps {
	localApi?: string;
}
export const getFetchSubjectGroupApi = (props: IFetchSubjectGroupBodyApiProps) => {
	const {
		localApi,
		pageIndex,
		pageSize,
		schoolId,
		schoolYearId,
		grade,
		subjectGroupId,
		deletedIncluded,
	} = props;
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
	return `${
		localApi ?? api
	}/api/schools/${schoolId}/academic-years/${schoolYearId}/subject-groups?${queryString}`;
};

// Fetch term API
export const getFetchTermApi = ({
	localApi,
	schoolId,
}: {
	localApi?: string;
	schoolId: string;
}) => {
	return `${localApi ?? api}/api/terms/${schoolId}`;
};

// Create Subject Group API
export const getCreateSubjectGroupApi = ({
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
	}/api/schools/${schoolId}/academic-years/${schoolYearId}/subject-groups`;
};

// Update Subject Group API
export const getUpdateSubjectGroupApi = ({
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
	}/api/schools/${schoolId}/academic-years/${schoolYearId}/subject-groups/${subjectGroupId}`;
};

// Update Subject Group API
export const getDeleteSubjectGroupApi = ({
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
	}/api/schools/${schoolId}/academic-years/${schoolYearId}/subject-groups/${subjectGroupId}`;
};

// Fetch Subject Option API
export const getFetchSubjectOptionsApi = ({
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

export const getFetchSubjectGroupDetailApi = ({
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
	}/api/schools/${schoolId}/academic-years/${schoolYearId}/subject-groups/${subjectGroupId}`;
};

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

export const getApplySubjectGroupApi = ({
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
	}/api/schools/${schoolId}/academic-years/${schoolYearId}/classes/assign-subject-group`;
};

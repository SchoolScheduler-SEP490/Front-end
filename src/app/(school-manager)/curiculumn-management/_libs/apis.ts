import { IFetchCurriculumBodyProps } from './constants';

const api = process.env.NEXT_PUBLIC_API_URL;

// Fetch Subject Group API
interface IFetchCurriculumBodyApiProps extends IFetchCurriculumBodyProps {
	localApi?: string;
}
export const getFetchCurriculumApi = (props: IFetchCurriculumBodyApiProps) => {
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
	}/api/schools/${schoolId}/academic-years/${schoolYearId}/curriculum?${queryString}`;
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
export const getCreateCurriculumApi = ({
	localApi,
	schoolId,
	schoolYearId,
}: {
	localApi?: string;
	schoolId: number;
	schoolYearId: number;
}) => {
	return `${localApi ?? api}/api/schools/${schoolId}/academic-years/${schoolYearId}/curriculum`;
};

// Update Subject Group API
export const getUpdateCurriculumApi = ({
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

// Update Subject Group API
export const getDeleteCurriculumApi = ({
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

export const getApplyCurriculumApi = ({
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

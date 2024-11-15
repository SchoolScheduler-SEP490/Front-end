import { IFetchSubjectGroupBodyProps } from './constants';

const api = process.env.NEXT_PUBLIC_API_URL;

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

export const getFetchSchoolYearApi = (localApi?: string) => {
	return `${localApi ?? api}/api/school-years`;
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

export const getUpdateLessonApi = ({
	localApi,
	schoolId,
	schoolYearId,
	subjectGroupId,
	termId,
}: {
	localApi?: string;
	schoolId: number;
	schoolYearId: number;
	subjectGroupId: number;
	termId?: number;
}) => {
	return `${
		localApi ?? api
	}/api/schools/${schoolId}/academic-years/${schoolYearId}/subject-groups/${subjectGroupId}/subject-in-groups${
		termId ? `?termId=${termId}` : ''
	}`;
};

export const getQuickAssignmentApi = ({
	schoolId,
	schoolYearId,
}: {
	schoolId: number;
	schoolYearId: number;
}) => {
	return `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/subject-groups/quick-assign-period-data`;
};

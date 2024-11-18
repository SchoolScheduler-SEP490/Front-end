import { IFetchCurriculumBodyProps } from './constants';

const api = process.env.NEXT_PUBLIC_API_URL;

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

export const getFetchSchoolYearApi = (localApi?: string) => {
	return `${localApi ?? api}/api/school-years`;
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

export const getUpdateCurriculumDetailsApi = ({
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
	}/api/schools/${schoolId}/academic-years/${schoolYearId}/curriculums/${subjectGroupId}/curriculum-details${
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
	return `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/curriculum/quick-assign-period-data`;
};

export const getQuickAssignCurriculumDetailsApi = ({
	schoolId,
	schoolYearId,
}: {
	schoolId: number;
	schoolYearId: number;
}) => {
	return `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/curriculum/quick-assign-period`;
};

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
		schoolId: schoolId,
		pageSize: pageSize.toString(),
		pageIndex: pageIndex.toString(),
		schoolYearId: schoolYearId.toString(),
		...(grade !== undefined && { grade: grade.toString() }),
		...(subjectGroupId !== undefined && {
			subjectGroupId: subjectGroupId.toString(),
		}),
		...(deletedIncluded !== undefined && {
			includeDeleted: deletedIncluded.toString(),
		}),
	}).toString();
	return `${localApi ?? api}/api/subject-groups?${queryString}`;
};

export const getFetchSchoolYearApi = (localApi?: string) => {
	return `${localApi ?? api}/api/school-years`;
};

export const getFetchSubjectGroupDetailApi = ({
	localApi,
	subjectGroupId,
}: {
	localApi?: string;
	subjectGroupId: number;
}) => {
	return `${localApi ?? api}/api/subject-groups/${subjectGroupId}`;
};

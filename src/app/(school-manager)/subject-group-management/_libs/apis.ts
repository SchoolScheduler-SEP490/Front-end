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
		schoolId: schoolId,
		pageSize: pageSize.toString(),
		pageIndex: pageIndex.toString(),
		schoolYearId: schoolYearId.toString(),
		...(grade !== undefined && { grade }),
		...(subjectGroupId !== undefined && {
			subjectGroupId: subjectGroupId.toString(),
		}),
		...(deletedIncluded !== undefined && {
			includeDeleted: deletedIncluded.toString(),
		}),
	}).toString();
	return `${localApi ?? api}/api/subject-groups?${queryString}`;
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
}: {
	localApi?: string;
	schoolId: string;
}) => {
	return `${localApi ?? api}/api/subject-groups?schoolId=${schoolId}`;
};

// Update Subject Group API
export const getUpdateSubjectGroupApi = ({
	localApi,
	subjectGroupId,
}: {
	localApi?: string;
	subjectGroupId: number;
}) => {
	return `${localApi ?? api}/api/subject-groups/${subjectGroupId}`;
};

// Update Subject Group API
export const getDeleteSubjectGroupApi = ({
	localApi,
	subjectGroupId,
}: {
	localApi?: string;
	subjectGroupId: number;
}) => {
	return `${localApi ?? api}/api/subject-groups/${subjectGroupId}`;
};

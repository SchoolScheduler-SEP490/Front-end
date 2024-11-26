const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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

const api = process.env.NEXT_PUBLIC_API_URL ?? 'Unknown';

export const getCreateSchoolYearApi = () => {
	return `${api}/api/academic-years`;
};

export const getUpdateSchoolYearStatusApi = (schoolYearId: number, newStatus: boolean) => {
	return `${api}/api/academic-years/${schoolYearId}/update-public-status?status=${newStatus}`;
};

export const getUpdateSchoolYearApi = (schoolYearId: number) => {
	return `${api}/api/academic-years/${schoolYearId}`;
};

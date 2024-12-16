const api = process.env.NEXT_PUBLIC_API_URL;

export const getTerms = async (sessionToken: string, selectedSchoolYearId: number) => {
	const initialResponse = await fetch(
		`${api}/api/academic-years/${selectedSchoolYearId}/terms?pageIndex=1&pageSize=20`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${sessionToken}`,
			},
		}
	);

	const initialData = await initialResponse.json();
	const totalCount = initialData.result['total-item-count'];

	const response = await fetch(
		`${api}/api/academic-years/${selectedSchoolYearId}/terms?pageIndex=1&pageSize=${totalCount}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${sessionToken}`,
			},
		}
	);
	const data = await response.json();
	return data;
};

export const getFetchWeekDaysApi = ({
	schoolId,
	termId,
	weekNumber,
	yearId,
}: {
	termId: number;
	weekNumber?: number;
	schoolId: number;
	yearId: number;
}) => {
	return `${api}/api/schools/${schoolId}/academic-years/${yearId}/timetables/get-week-dates?termId=${termId}${
		weekNumber ? `&weekNumber=${weekNumber}` : ''
	}`;
};

export const getUpdateTimetableApi = ({
	schoolId,
	yearId,
}: {
	schoolId: number;
	yearId: number;
}) => {
	return `${api}/api/schools/${schoolId}/academic-years/${yearId}/timetables/student-class-period-change`;
};

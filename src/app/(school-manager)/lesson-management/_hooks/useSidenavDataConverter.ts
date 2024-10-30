import {
	ISubjectGroupObjectResponse,
	ISubjectGroupSidenavData,
} from '../_libs/constants';

const useSidenavDataConverter = (
	data: ISubjectGroupObjectResponse[]
): ISubjectGroupSidenavData[] => {
	const gradeTitles: { [key: string]: string } = {
		GRADE_10: 'Khối 10',
		GRADE_11: 'Khối 11',
		GRADE_12: 'Khối 12',
	};

	// Use reduce to group data by grade
	const groupedData = data.reduce<{ [key: string]: ISubjectGroupSidenavData }>(
		(acc, item) => {
			const grade = item.grade;
			if (!acc[grade]) {
				acc[grade] = {
					title: gradeTitles[grade] || grade,
					items: [],
				};
			}
			acc[grade].items.push({
				key: item['group-name'],
				value: item.id,
			});
			return acc;
		},
		{}
	);

	// Convert the grouped object to an array and sort it by grade order
	return Object.values(groupedData).sort((a, b) => {
		const gradeOrder = ['Khối 10', 'Khối 11', 'Khối 12'];
		return gradeOrder.indexOf(a.title) - gradeOrder.indexOf(b.title);
	});
};

export default useSidenavDataConverter;

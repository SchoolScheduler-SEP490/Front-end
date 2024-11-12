import { IClassResponse, ITeachingAssignmentSidenavData } from '../_libs/constants';

function customSort(
	arr: { key: string; value: number; extra: string }[]
): { key: string; value: number; extra: string }[] {
	// Bước 1: Chia mảng lớn thành các mảng con có cùng độ dài chuỗi
	const lengthMap: { [key: number]: { key: string; value: number; extra: string }[] } = {};

	arr.forEach((item) => {
		const length = item.key.length;
		if (!lengthMap[length]) {
			lengthMap[length] = [];
		}
		lengthMap[length].push(item);
	});

	// Bước 2: Sắp xếp các mảng con
	const sortedSubArrays = Object.keys(lengthMap)
		.map(Number)
		.sort((a, b) => a - b)
		.map((key) => {
			return lengthMap[key].sort((a, b) => a.key.localeCompare(b.key));
		});

	// Bước 3: Nối các mảng con theo thứ tự chiều dài chuỗi
	return sortedSubArrays.flat();
}

const useSidenavDataConverter = (data: IClassResponse[]): ITeachingAssignmentSidenavData[] => {
	const gradeTitles: { [key: string]: string } = {
		GRADE_10: 'Khối 10',
		GRADE_11: 'Khối 11',
		GRADE_12: 'Khối 12',
	};

	// Use reduce to group data by grade
	const groupedData = data.reduce<{ [key: string]: ITeachingAssignmentSidenavData }>(
		(acc, item) => {
			const grade = item.grade;
			if (!acc[grade]) {
				acc[grade] = {
					title: gradeTitles[grade] || grade,
					items: [],
				};
			}
			acc[grade].items.push({
				key: item.name,
				value: item.id,
				extra: item['subject-group-name'],
			});
			return acc;
		},
		{}
	);

	// Convert the grouped object to an array and sort it by grade order
	return Object.values(groupedData)
		.map((group) => ({
			...group,
			items: customSort(group.items),
		}))
		.sort((a, b) => {
			const gradeOrder = ['Khối 10', 'Khối 11', 'Khối 12'];
			return gradeOrder.indexOf(a.title) - gradeOrder.indexOf(b.title);
		});
};

export default useSidenavDataConverter;

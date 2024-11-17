import { GroupedClasses } from '../_libs/constants';

interface StudentClass {
	'student-class-name': string;
}

const useGroupByGrade = (classes: StudentClass[]): GroupedClasses => {
	const grouped: GroupedClasses = {};

	classes.forEach(({ 'student-class-name': className }) => {
		// Extract the grade number (e.g., "10" from "10A1")
		const match = className.match(/^(\d+)/);
		const grade = match ? match[1] : '';

		if (grade) {
			// Initialize the array for this grade if it doesn't exist
			if (!grouped[grade]) {
				grouped[grade] = [];
			}
			// Add the class to the appropriate grade group
			grouped[grade].push(className);
		}
	});

	return grouped;
};

export default useGroupByGrade;

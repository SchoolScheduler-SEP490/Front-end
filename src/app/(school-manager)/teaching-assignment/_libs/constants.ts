export interface IClassResponse {
	name: string;
	'homeroom-teacher-id': number;
	'homeroom-teacher-name': string;
	'homeroom-teacher-abbreviation': string;
	'main-session': number;
	'main-session-text': string;
	grade: string;
	'is-full-day': boolean;
	'period-count': number;
	'subject-group-id': number;
	'subject-group-name': string;
	'school-year-id': number;
	id: number;
	'create-date': string;
	'update-date': string | null;
	'is-deleted': boolean;
}

export interface ITeachingAssignmentSidenavData {
	title: string;
	items: { key: string; value: number }[];
}

export interface IDropdownOption<T> {
	value: T;
	label: string;
}

export interface ITermResponse {
	id: number;
	name: string;
	'start-date': string;
	'end-date': string;
	'school-year-id': number;
	'school-year-code': string;
	'school-year-start': string;
	'school-year-end': string;
	'school-id': number;
}

export interface ITeacherAssignmentRequest {
	'teacher-id': number;
	'subject-id': number;
	'period-count': number;
	'term-id': number;
	'student-class-id': number;
}

export interface ISchoolYearResponse {
	id: number;
	'start-year': string;
	'end-year': string;
	'school-year-code': string;
}

export interface ITeachingAssignmentTableData {
	id: number;
	subjectName: string;
	teacherName: string | undefined;
	totalSlotPerWeek: number;
}

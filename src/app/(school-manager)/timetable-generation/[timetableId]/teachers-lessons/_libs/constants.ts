export interface ITeachersLessonsSidenavData {
	title: string;
	items: { key: string; value: number; extra: string }[];
	grade: string;
}

export interface IClassResponse {
	id: number;
	name: string;
	'homeroom-teacher-id': number;
	'homeroom-teacher-name': string;
	'homeroom-teacher-abbreviation': string;
	'main-session': number;
	'main-session-text': string;
	grade: string;
	'is-full-day': boolean;
	'period-count': number;
	'subject-group-id': number | null;
	'student-class-group-name': string;
	'curriculum-id': number | null;
	'curriculum-name': string | null;
	'school-year-id': number;
	'room-id': number;
	'room-name': string;
	'create-date': string;
	'update-date': string;
	'is-deleted': boolean;
}

export interface ITeacherResponse {
	id: number;
	'first-name': string;
	'last-name': string;
	abbreviation: string;
	email: string;
	gender: string;
	'department-id': number;
	'department-name': string;
	'date-of-birth': string;
	'teacher-role': string;
	status: number;
	'is-deleted': boolean;
	phone: string;
	'teachable-subjects': ITeachableSubject[];
}

export interface ITeachableSubject {
	'subject-id': number;
	'subject-name': string;
	abbreviation: string;
}

export interface ITeachersLessonsObject {
	teacherId: number;
	teacherName: string;
	classId: number;
	className: string;
	subjectId: number;
	subjectName: string;
	slots: number[];
}

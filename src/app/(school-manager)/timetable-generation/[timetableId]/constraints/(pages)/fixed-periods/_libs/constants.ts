import { IFixedPeriodObject } from '@/app/(school-manager)/timetable-generation/_libs/constants';

export interface IExtendedFixedPeriod extends IFixedPeriodObject {
	subjectName: string;
	className: string;
	teacherName: string;
	teacherId: number;
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

export interface IAssignmentResponse {
	'period-count': number;
	'student-class-id': number;
	'assignment-type': string;
	'subject-id': number;
	'subject-name': string;
	'teacher-id': number;
	'teacher-first-name': string;
	'teacher-last-name': string;
	'teacher-abbreviation': string;
	id: number;
	'create-date': string;
	'update-date': string | null;
	'is-deleted': boolean;
}

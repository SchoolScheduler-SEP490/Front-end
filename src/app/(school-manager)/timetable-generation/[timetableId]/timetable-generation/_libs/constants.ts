import {
	IClassCombinationObject,
	IFixedPeriodObject,
	IFreePeriodObject,
	INoAssignPeriodObject,
	ITeachingAssignmentObject,
} from '@/utils/constants';

export interface IGenerateTimetableRequest {
	'start-week': number;
	'end-week': number;
	'timetable-name': string;
	'fixed-periods-para': { 'class-id': number; 'start-at': number; 'subject-id': number }[];
	'no-assign-periods-para': INoAssignPeriodObject[];
	'free-timetable-periods-para': IFreePeriodObject[];
	'teacher-assignments': ITeachingAssignmentObject[];
	'class-combinations': IClassCombinationObject[];
	'required-break-periods': number;
	'minimum-days-off': number;
	'term-id': number;
	'days-in-week': number;
}

export interface ITeacherResponse {
	id: number;
	'first-name': string;
	'last-name': string;
	abbreviation: string;
	email: string;
	gender: string;
	'is-home-room-teacher': boolean;
	'student-class-id': number;
	'home-room-teacher-of-class': string;
	'department-id': number;
	'department-name': string;
	'date-of-birth': string;
	'teacher-role': string;
	status: number;
	'is-deleted': boolean;
	phone: string;
	'period-count': number;
	'teachable-subjects': ITeachableSubject[];
}
export interface ITeachableSubject {
	id: number;
	'subject-id': number;
	'subject-name': string;
	abbreviation: string;
	'list-appropriate-level-by-grades': {
		'appropriate-level': string;
		grade: string;
	}[];
	'is-main': boolean;
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

export interface ITimetableDisplayData {
	classId: number;
	className: string;
	periods: IPeriodDisplayData[];
}

export interface IPeriodDisplayData {
	teacherId: number;
	teacherName: string;
	subjectId: number;
	subjectAbbreviation: string;
	slot: number;
}

export interface ISubjectResponse {
	id: number;
	'school-year-id': number;
	'school-year-code': string;
	'subject-name': string;
	abbreviation: string;
	'is-required': boolean;
	description: string;
	'total-slot-in-year': number;
	'slot-specialized': number;
	'create-date': string;
	'update-date': string | null;
	'is-deleted': boolean;
	'subject-group-type': string;
}

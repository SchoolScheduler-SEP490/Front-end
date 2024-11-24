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

export interface ICurriculumResponse {
	id: number;
	'curriculum-name': string;
	'curriculum-code': string;
	grade: string;
}

export interface ICurriculumDetailResponse {
	id: number;
	'curriculum-name': string;
	'curriculum-code': string;
	grade: string;
	'subject-selective-views': ISubjectInGroup[];
	'subject-specializedt-views': ISubjectInGroup[];
	'subject-required-views': ISubjectInGroup[];
	'student-class-group-view-names': string[];
}

export interface ISubjectInGroup {
	id: number;
	'subject-id': number;
	'subject-name': string;
	abbreviation: string;
	'subject-in-group-type': number;
	'is-required': boolean;
	description: string;
	'main-slot-per-week': number;
	'sub-slot-per-week': number;
	'total-slot-per-week': number;
	'is-specialized': boolean;
	'is-double-period': boolean;
	'slot-per-term': number;
	'term-id': number;
	'total-slot-in-year': number;
	'slot-specialized': number;
	'subject-group-type': string;
	'main-minimum-couple': number;
	'sub-minimum-couple': number;
}

export interface IClassGroupResponse {
	id: number;
	'group-name': string;
	'school-id': number;
	'curriculum-id': number;
	'group-description': string;
	'student-class-group-code': string;
	grade: number;
	'school-year-id': number;
	classes: {
		id: number;
		name: string;
	}[];
	'create-date': string;
	'update-date': string;
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
	'student-class-group-id': number;
	'student-class-group-name': string;
	'student-class-group-code': string;
	'curriculum-id': number | null;
	'curriculum-name': string;
	'curriculum-code': string | null;
	'school-year-id': number;
	'room-id': number;
	'room-name': string;
	'create-date': string;
	'update-date': string;
	'is-deleted': boolean;
}

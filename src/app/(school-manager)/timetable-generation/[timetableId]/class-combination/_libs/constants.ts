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

export interface ISubjectResponse {
	id: number;
	'subject-name': string;
	abbreviation: string;
	'is-required': boolean;
	description: string;
	'create-date': string;
	'update-date': string;
	'is-deleted': boolean;
	'subject-group-type': string;
	'school-year-id': number;
	'school-year-code': string;
	'total-slot-in-year': number;
	'slot-specialized': number;
}

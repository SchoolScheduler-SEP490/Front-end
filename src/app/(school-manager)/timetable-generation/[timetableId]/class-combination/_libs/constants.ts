import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import { IClassCombinationObject } from '../../../_libs/constants';

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

export interface IClassCombinationResponse {
	id: number;
	name: string;
}

export interface IExtendedClassCombination extends IClassCombinationObject {
	'subject-name': string;
	'class-names': string[];
	'room-name'?: string;
	'teacher-name': IDropdownOption<number>;
}

export interface ITeachableResponse {
	'teacher-id': number;
	'teacher-name': string;
	'teacher-abreviation': string;
	'subject-id': number;
	'subject-name': string;
	'subject-abreviation': string;
	id: number;
	'create-date': string;
	'update-date': string | null;
	'is-deleted': boolean;
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

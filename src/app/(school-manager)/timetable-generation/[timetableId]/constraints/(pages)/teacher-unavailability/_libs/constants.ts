import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import { ITeachingAssignmentObject } from '@/app/(school-manager)/timetable-generation/_libs/constants';

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

export interface IExtendedTeachingAssignment extends ITeachingAssignmentObject {
	teacherObject: ITeacherResponse;
}

export interface IFilterableDropdownOption<T> extends IDropdownOption<T> {
	filterableId: number;
}

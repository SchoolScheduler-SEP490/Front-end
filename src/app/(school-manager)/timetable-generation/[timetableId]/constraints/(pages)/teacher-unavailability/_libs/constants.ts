import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import { ITeachingAssignmentObject } from '@/app/(school-manager)/timetable-generation/_libs/constants';

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

export interface IExtendedTeachingAssignment extends ITeachingAssignmentObject {
	teacherObject: ITeacherResponse;
}

export interface IFilterableDropdownOption<T> extends IDropdownOption<T> {
	filterableId: number;
}

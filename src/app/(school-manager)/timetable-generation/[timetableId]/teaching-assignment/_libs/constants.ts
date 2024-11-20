import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import { ITeachingAssignmentObject } from '../../../_libs/constants';

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

export interface ITeachingAssignmentSidenavData {
	title: string;
	items: { key: string; value: number; extra: string }[];
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
	id: number;
	'teacher-id': number;
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
	teacherName: IDropdownOption<number>;
	totalSlotPerWeek: number;
	subjectKey: number;
}

export interface ITeachingAssignmentResponse {
	'teachable-subject-id': number;
	'period-count': number;
	'student-class-id': number;
	'assignment-type': string;
	'subject-id': number;
	'subject-name': string;
	'teacher-id': number | null;
	'teacher-first-name': string;
	'teacher-last-name': string;
	'teacher-abbreviation': string;
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

export interface ITeachableResponse {
	'teacher-id': number;
	'teacher-name': string;
	'teacher-abreviation': string;
	'subject-id': number;
	'subject-name': string;
	'subject-abbreviation': string;
	id: number;
	'create-date': string;
	'update-date': string | null;
	'is-deleted': boolean;
}

export interface ITeachingAssignmentAvailabilityResponse {
	'Giáo viên': string[];
	'Lớp học': string[];
	'Năm học': string[];
	'Môn học': string[];
}
export const ENTITY_TARGET: { [key: string]: string } = {
	'Giáo viên': '/teacher-management',
	'Lớp học': '/class-management',
	'Năm học': '',
	'Môn học': '/teacher-management',
};

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

export interface ITeachingPeriodCountResponse {
	'teacher-id': number;
	'teacher-name': string;
	'teacher-abbreviation': string;
	'total-periods-per-week': number;
}

export interface IAutoTeacherAssignmentResponse {
	'assignment-minimal-data': ITeachingAssignmentObject[];
	assignments: IAssignmentResponse[];
	'teacher-periods-count': ITeachingPeriodCountResponse[];
	'term-id': number;
	'term-name': string;
}

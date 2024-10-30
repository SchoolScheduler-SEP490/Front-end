// SubjectGroup Fetcher Props
export interface IFetchSubjectGroupBodyProps {
	sessionToken: string;
	pageSize: number;
	pageIndex: number;
	schoolId: string;
	schoolYearId: number;
	subjectGroupId?: number;
	grade?: number;
	deletedIncluded?: boolean;
}

//SubjectGroup Data response
export interface ISubjectGroupObjectResponse {
	id: number;
	'group-code': string;
	'group-name': string;
	'school-id': number;
	'school-name': string;
	'group-description': string | null;
	grade: string;
	'subject-group-type-name': string | null;
	'school-year-id': number;
}

export interface ISubjectGroupSidenavData {
	title: string;
	items: { key: string; value: number }[];
}

export interface IYearDropdownOption<T> {
	value: T;
	label: string;
}

export interface ISchoolYearResponse {
	id: number;
	'start-year': string;
	'end-year': string;
	'school-year-code': string;
}

export interface ILessonTableData {
	id: number;
	lessonName: string;
	mainTotalSlotPerWeek: number;
	isDouleSlot: boolean;
	subTotalSlotPerWeek: number;
	subIsDouleSlot: boolean;
	isRequiredSubject: boolean;
}

export interface ISubjectGroupDetailResponse {
	id: number;
	'group-code': string;
	'group-name': string;
	'school-id': number;
	'group-description': string;
	grade: string;
	'subject-selective-views': ISGSubject[];
	'subject-specializedt-views': ISGSubject[];
	'subject-required-views': ISGSubject[];
	'student-class-views': any[];
	'subject-group-type-name': string | null;
	'school-year-id': number;
	'school-year': string;
}

export interface ISGSubject {
	'subject-name': string;
	abbreviation: string;
	'is-required': boolean;
	description: string;
	'main-slot-per-week': number;
	'sub-slot-per-week': number;
	'tootal-slot-per-week': number;
	'is-specialized': boolean;
	'is-double-period': boolean;
	'slot-per-term': number;
	'term-id': number;
	'total-slot-in-year': number;
	'slot-specialized': number;
	'subject-group-type': string;
}

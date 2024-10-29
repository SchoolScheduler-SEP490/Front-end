export interface ISubjectGroup {
	id: number;
	'group-code': string;
	'group-name': string;
	'school-id': number;
	'school-name': string;
	'group-description': string;
	grade: string;
	'subject-group-type-name': string | null;
	'school-year-id': number;
}
// Table SubjectGroup Data
export interface ISubjectGroupTableData {
	id: number;
	subjectGroupName: string;
	subjectGroupCode: string;
	grade: string;
	subjectGroupKey: number;
}

// Fetcher Props
export interface IFetchSubjectGroupBodyProps {
	sessionToken: string;
	pageSize: number;
	pageIndex: number;
	schoolId: string;
	schoolYearId: number;
	subjectGroupId?: number;
	grade?: string;
	deletedIncluded?: boolean;
}

//Create SubjectGroup Data
export interface ICreateSubjectGroupRequest {
	'group-name': string;
	'group-code': string;
	'group-description': string;
	grade: string;
	'school-year-id': number;
	'elective-subject-ids': number[];
	'specialized-subject-ids': number[];
}

// Update SubjectGroup Data
export interface IUpdateSubjectGroupRequest {
	'group-name': string;
	'group-code': string;
	'group-description': string;
	grade: string;
	'is-deleted'?: boolean;
	'school-year-id': number;
	'elective-subject-ids': number[];
	'specialized-subject-ids': number[];
}

export interface IDropdownOption<T> {
	value: T;
	label: string;
}

export interface ISubjectOptionResponse {
	id: number;
	'subject-name': string;
	abbreviation: string;
	'is-required': boolean;
	description: string;
	'create-date': string;
	'update-date': string;
	'is-deleted': boolean;
	'subject-group-type': string;
}

export interface ISchoolYearResponse {
	id: number;
	'start-year': string;
	'end-year': string;
	'school-year-code': string;
}

export interface ISubjectGroupDetailResponse {
	id: number;
	'group-code': string;
	'group-name': string;
	'school-id': number;
	'group-description': string;
	grade: string;
	'subject-selective-views': ISelectiveSubject[];
	'subject-specializedt-views': ISelectiveSubject[];
	'subject-required-views': ISelectiveSubject[];
	'student-class-views': any[];
	'subject-group-type-name': string | null;
	'school-year-id': number;
	'school-year': string;
}

export interface ISelectiveSubject {
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

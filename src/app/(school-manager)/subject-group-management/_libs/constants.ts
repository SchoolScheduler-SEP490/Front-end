export interface ISubjectGroup {
	id: number;
	'group-code': string;
	'group-name': string;
	'school-id': number;
	'school-name': string;
	'group-description': string;
	grade: number;
	'subject-group-type-name': string | null;
	'school-year-id': number;
}
// Table SubjectGroup Data
export interface ISubjectGroupTableData {
	id: number;
	subjectGroupName: string;
	subjectGroupCode: string;
	grade: number;
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
	grade?: number;
	deletedIncluded?: boolean;
}

//Create SubjectGroup Data
export interface ICreateSubjectGroupRequest {
	'group-name': string;
	'group-code': string;
	'group-description': string;
	grade: number;
	'school-year-id': number;
	'elective-subject-ids': number[];
	'specialized-subject-ids': number[];
}

// Update SubjectGroup Data
export interface IUpdateSubjectGroupRequest {
	'group-name': string;
	'group-code': string;
	'group-description': string;
	grade: number;
	'is-deleted'?: boolean;
	'school-year-id': number;
	'elective-subject-ids': number[];
	'specialized-subject-ids': number[];
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
	'subject-selective-views': ISubjectInGroup[];
	'subject-specializedt-views': ISubjectInGroup[];
	'subject-required-views': ISubjectInGroup[];
	'student-class-views': { 'student-class-name': string }[];
	'subject-group-type-name': string | null;
	'school-year-id': number;
	'school-year': string;
}

export interface ISubjectInGroup {
	id: number;
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

export interface ISGClassResponse {
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
	'subject-group-id': number;
	'subject-group-name': string;
	'school-year-id': number;
	'create-date': string;
	'update-date': string;
	'is-deleted': boolean;
}

export interface IClassApplyOption {
	classId: string;
	className: string;
	existingSubjectGroup: string | null;
}

export interface IVulnerableClass {
	className: string;
	existingGroupName: string;
}

export interface IApplySubjectGroupRequest {
	'class-ids': number[];
	'subject-group-id': number;
}

export interface GroupedClasses {
	[key: string]: string[];
}

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
	subjectGroupTypeName: string;
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

// Create SubjectGroup Response
export interface ICreateSubjectGroupResponse {
	// Add something here
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

// Fetch Term Data response
export interface IFetchTermResponse {
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

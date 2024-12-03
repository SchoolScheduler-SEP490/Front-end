export interface ICurriculumResponse {
	id: number;
	'curriculum-name': string;
	'curriculum-code': string;
	grade: string;
}
// Table Curriculum Data
export interface ICurriculumTableData {
	id: number;
	curriculumName: string;
	curriculumCode: string;
	grade: number;
	curriculumKey: number;
}

// Fetcher Props
export interface IFetchCurriculumBodyProps {
	sessionToken: string;
	pageSize: number;
	pageIndex: number;
	schoolId: string;
	schoolYearId: number;
	subjectGroupId?: number;
	grade?: number;
	deletedIncluded?: boolean;
}

//Create Curriculum Data
export interface ICreateCurriculumRequest {
	'curriculum-name': string;
	'curriculum-code': string;
	grade: number;
	'elective-subject-ids': number[];
	'specialized-subject-ids': number[];
}

// Update Curriculum Data
export interface IUpdateCurriculumRequest {
	'curriculum-name': string;
	'curriculum-code': string;
	grade: number;
	'elective-subject-ids': number[];
	'specialized-subject-ids': number[];
}

export interface ISubjectOptionResponse {
	id: number;
	'school-year-id': number;
	'school-year-code': string;
	'subject-name': string;
	abbreviation: string;
	'is-required': boolean;
	description: string;
	'total-slot-in-year': number;
	'slot-specialized': number;
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
	existingCurriculum: string | null;
}

export interface IVulnerableClass {
	className: string;
	existingGroupName: string;
}

export interface IApplyCurriculumRequest {
	'class-ids': number[];
	'subject-group-id': number;
}

export interface GroupedClasses {
	[key: string]: string[];
}

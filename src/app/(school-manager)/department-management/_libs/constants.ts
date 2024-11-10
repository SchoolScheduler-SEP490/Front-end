export interface IDepartmentTableData {
	id: number;
	departmentName: string;
	departmentCode: string;
	description: string;
	departmentKey: number;
}

export interface IDepartmentResponse {
	id: number;
	name: string;
	description: string | null;
	'department-code': string;
	'create-date': string;
	'update-date': string | null;
	'is-deleted': boolean;
}

export interface ICreateDepartmentRequest {
	name: string;
	description: string;
	'department-code': string;
}

export interface IUpdateDepartmentRequest {
	name: string;
	description: string;
	'department-code': string;
}

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
	'subject-group-id': number;
	'subject-group-name': string;
	'school-year-id': number;
	'create-date': string;
	'update-date': string | null;
	'is-deleted': boolean;
}

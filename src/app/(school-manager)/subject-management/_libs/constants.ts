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
// Table Subject Data
export interface ISubjectTableData {
	id: number;
	subjectName: string;
	subjectCode: string;
	subjectGroup: string;
	subjectType: string;
	subjectKey: number;
}

export interface ITeachableTeacherResponse {
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

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

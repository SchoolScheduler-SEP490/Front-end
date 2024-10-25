export interface ISubject {
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
// Table Subject Data
export interface ISubjectTableData {
	id: number;
	subjectName: string;
	subjectCode: string;
	subjectGroup: string;
	subjectType: string;
	subjectKey: number;
}
//Create Subject Data
export interface IAddSubjectRequestBody {
	'subject-name': string;
	abbreviation: string;
	description: string;
	'is-required': boolean;
	'subject-group-type': string;
	'total-slot-in-year'?: number;
	'slot-specialized'?: number;
}
// Create Subject Response
export interface ICreateSubjectResponse {
	message: string;
	result: {
		'added-subjects': string[];
	};
	status: number;
}
// Update Subject Data
export interface IUpdateSubjectRequestBody {
	'subject-name': string;
	abbreviation: string;
	description: string;
	'is-required': boolean;
	'total-slot-in-year'?: number;
	'slot-specialized'?: number;
	'subject-group-type': string;
}

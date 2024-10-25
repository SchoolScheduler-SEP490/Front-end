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
//Create SubjectGroup Data
export interface IAddSubjectGroupRequestBody {
	// Add something here
}
// Create SubjectGroup Response
export interface ICreateSubjectGroupResponse {
	// Add something here
}
// Update SubjectGroup Data
export interface IUpdateSubjectGroupRequestBody {
	// Add something here
}

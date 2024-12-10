export interface IAccountResponse {
	id: number;
	'school-id': number;
	'school-name': string;
	email: string;
	phone: string;
	status: string;
	'create-date': string;
}

export interface ITopSchoolObject extends IAccountResponse {
	totalTimetable: number;
}

export interface ITotalNumberObject {
	averageFitness: number;
	averageTimeCost: number;
	totalSchoolUsed: number;
	averageTimetablePerSchool: number;
}

export interface IUpdateAccountRequest {
	'account-id': number;
	'account-status': string;
}

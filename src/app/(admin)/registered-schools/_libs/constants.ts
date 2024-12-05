export interface ISchoolResponse {
	id: number;
	name: string;
	address: string;
	'province-id': number;
	'province-name': string;
	'district-code': number;
	status: string;
	'update-date': string | null;
}

export interface IDistrictResponse {
	'province-id': number;
	name: string;
	'district-code': number;
}

export interface IProvinceResponse {
	id: number;
	name: string;
}

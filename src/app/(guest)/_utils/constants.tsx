export interface ISchoolResponse {
	status: number;
	message: string;
	result: {
		'total-item-count': number;
		'page-size': number;
		'total-pages-count': number;
		'page-index': number;
		next: boolean;
		previous: boolean;
		items: ISchool[];
	};
}

export interface ISchool {
	id: number;
	name: string;
	address: string;
	'province-id': number;
	'province-name': string;
	'district-code': number;
	status: string;
	'update-date': string;
}

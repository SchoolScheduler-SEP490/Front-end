export interface IRequestResponse {
	'teacher-id': number;
	'teacher-first-name': string;
	'teacher-last-name': string;
	'request-type': string;
	'request-time': string;
	status: 'Pending' | 'Approved' | 'Rejected';
	'request-description': string;
	'process-note': string | null;
	'attached-file': string | null;
	'school-year-id': number;
	'school-year-code': string;
	id: number;
	'create-date': string;
	'update-date': string | null;
	'is-deleted': false;
}

export interface IUpdateRequestBody {
    status: 'Approved' | 'Rejected';
    'process-note': string | null;
}

export const REQUEST_STATUS_TRANSLATOR: {[key: string]: string} = {
    Pending: 'Chờ duyệt',
    Approved: 'Đã duyệt',
    Rejected: 'Đã từ chối',
}
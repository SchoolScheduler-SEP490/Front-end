import { INavigation } from '@/utils/constants';

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

export const NAV_LINKS: INavigation[] = [
	{
		name: 'Trang chủ',
		url: '/landing',
	},
	{
		name: 'Thời khóa biểu',
		url: '/schedules',
	},
	{
		name: 'Cộng đồng',
		url: '/community',
	},
	{
		name: 'Liên hệ',
		url: '/contact',
	},
];

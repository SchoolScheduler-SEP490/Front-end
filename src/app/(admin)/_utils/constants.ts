import { INavigation } from '@/utils/constants';

export interface IAdminSidenav {
	category: string;
	items: IAdminNavigation[];
}

export interface IAdminNavigation extends INavigation {
	icon: string;
}

export const ADMIN_SIDENAV: IAdminNavigation[] = [
	{
		name: 'Tổng quan',
		url: '/dashboard',
		icon: '/images/icons/schedule.png',
	},
	{
		name: 'Người dùng',
		url: '/accounts',
		icon: '/images/icons/multiple-users-silhouette.png',
	},
	{
		name: 'Trường học',
		url: '/registered-schools',
		icon: '/images/icons/classroom.png',
	},
	{
		name: 'Môn học',
		url: '/subjects',
		icon: '/images/icons/books.png',
	},
	{
		name: 'Vùng miền',
		url: '/regions',
		icon: '/images/icons/map.png',
	},
	{
		name: 'Năm học',
		url: '/school-years',
		icon: '/images/icons/calendar.png',
	},
];

export const ACCOUNT_STATUS: { [key: string]: string } = {
	Pending: 'Chờ duyệt',
	Active: 'Hoạt động',
	Inactive: 'Vô hiệu',
};

export const SCHOOL_STATUS: { [key: string]: string } = {
	Validating: 'Đang xác thực',
	Pending: 'Chưa hoạt động',
	Active: 'Hoạt động',
	Inactive: 'Vô hiệu',
};

export const DROPDOWN_ACCOUNT_STATUS: { [key: string]: string } = {
	All: 'Tất cả',
	Pending: 'Chờ duyệt',
	Active: 'Hoạt động',
	Inactive: 'Vô hiệu',
};

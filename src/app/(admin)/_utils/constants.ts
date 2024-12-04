import { INavigation } from '@/utils/constants';

export interface IAdminSidenav {
	category: string;
	items: IAdminNavigation[];
}

export interface IAdminNavigation extends INavigation {
	icon: string;
}

export const ADMIN_SIDENAV: IAdminSidenav[] = [
	{
		category: 'Hoạt động',
		items: [
			{
				name: 'Thống kê',
				url: '/dashboard',
				icon: '/images/icons/schedule.png',
			},
			{
				name: 'Đơn xét duyệt',
				url: '/requests',
				icon: '/images/icons/timeline.png',
			},
		],
	},
	{
		category: 'Đối tượng',
		items: [
			{
				name: 'Người dùng',
				url: '/accounts',
				icon: '/images/icons/multiple-users-silhouette.png',
			},
			{
				name: 'Trường học',
				url: '/school-management',
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
		],
	},
];

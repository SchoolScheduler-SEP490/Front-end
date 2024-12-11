import { INavigation } from '@/utils/constants';

export interface IAdminSidenav {
	category: string;
	items: ITeacherNavigation[];
}

export interface ITeacherNavigation extends INavigation {
	icon: string;
}

export const TEACHER_SIDENAV: ITeacherNavigation[] = [
	{
		name: 'Lịch dạy học dự kiến',
		url: '/teacher-dashboard',
		icon: '/images/icons/schedule.png',
	},
	{
		name: 'Thời khóa biểu chính thức',
		url: '/timetable',
		icon: '/images/icons/teacher-calendar.png',
	},
	{
		name: 'Gửi biểu mẫu',
		url: '/application-form',
		icon: '/images/icons/forms.png',
	}
];

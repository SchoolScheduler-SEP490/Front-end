import { INavigation } from '@/utils/constants';
import { boolean } from 'yup';

export interface ISMSidenav {
	category: string;
	items: ISMNavigation[];
}

export interface ISMNavigation extends INavigation {
	icon: string;
}

export const SM_SIDENAV: ISMSidenav[] = [
	{
		category: 'Thời khóa biểu',
		items: [
			{
				name: 'Thời khóa biểu toàn trường',
				url: '/timetable-management',
				icon: '/images/icons/schedule.png',
			},
			{
				name: 'Thời khóa biểu từng lớp',
				url: '/timetable-management?classId=',
				icon: '/images/icons/timeline.png',
			},
			{
				name: 'Lịch sử dụng phòng',
				url: '/timetable-management?room=',
				icon: '/images/icons/availability.png',
			},
		],
	},
	{
		category: 'Đối tượng',
		items: [
			{
				name: 'Giáo viên',
				url: '/teacher-management',
				icon: '/images/icons/graduate.png',
			},
			{
				name: 'Môn học',
				url: '/subject-management',
				icon: '/images/icons/books.png',
			},
			{
				name: 'Tổ hợp môn',
				url: '/subject-group-management',
				icon: '/images/icons/stack.png',
			},
			{
				name: 'Tổ bộ môn',
				url: '/department-management',
				icon: '/images/icons/book.png',
			},
			{
				name: 'Tiết học',
				url: '/lesson-management',
				icon: '/images/icons/open-book.png',
			},
			{
				name: 'Nhóm lớp',
				url: '/class-group-management',
				icon: '/images/icons/multiple-users-silhouette.png',
			},
			{
				name: 'Lớp học',
				url: '/class-management',
				icon: '/images/icons/classroom.png',
			},
			{
				name: 'Phòng học',
				url: '/room-management',
				icon: '/images/icons/desk.png',
			},
		],
	},
	{
		category: 'Hoạt động',
		items: [
			{
				name: 'Nhập TKB',
				url: '/import-timetable',
				icon: '/images/icons/Import.png',
			},
			{
				name: 'Cấu hình chung',
				url: '/migrate-timetable',
				icon: '/images/icons/constraint.png',
			},
		],
	},
];

export interface IDropdownOption<T> {
	value: T;
	label: string;
}

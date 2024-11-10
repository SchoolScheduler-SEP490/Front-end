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
		category: 'Đối tượng',
		items: [
			{
				name: 'Thời khóa biểu',
				url: '/timetable-management',
				icon: '/images/icons/schedule.png',
			},
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
				name: 'Phân công dạy',
				url: '/teaching-assignment',
				icon: '/images/icons/selection.png',
			},
			{
				name: 'Phân công GVCN',
				url: '/homeroom-assignment',
				icon: '/images/icons/conference.png',
			},
			{
				name: 'Ràng buộc hệ thống',
				url: '/system-constraint',
				icon: '/images/icons/constraint.png',
			},
			{
				name: 'Nhập TKB',
				url: '/import-timetable',
				icon: '/images/icons/Import.png',
			},
			{
				name: 'Chuyển TKB sang năm học mới',
				url: '/migrate-timetable',
				icon: '/images/icons/duplicate.png',
			},
		],
	},
];

export interface IDropdownOption<T> {
	value: T;
	label: string;
}

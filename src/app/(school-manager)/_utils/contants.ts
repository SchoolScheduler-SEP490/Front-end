import { INavigation } from '@/utils/constants';

export interface ISMSidenav {
	category: string;
	items: ISMNavigation[];
}

export interface ISMNavigation extends INavigation {
	icon: string;
}

export const SM_SIDENAV: ISMSidenav[] = [
	{
		category: 'TKB chính thức',
		items: [
			{
				name: 'Thời khóa biểu',
				url: '/publish-timetable',
				icon: '/images/icons/schedule.png',
			},
			{
				name: 'Thời khóa biểu lớp',
				url: '/class-timetable',
				icon: '/images/icons/timeline.png',
			},
			{
				name: 'Lịch sử dụng phòng',
				url: '/room-availability',
				icon: '/images/icons/teacher-timetable.png',
			}
		],
	},
	{
		category: 'Cấu hình',
		items: [
			{
				name: 'Bản thảo TKB',
				url: '/timetable-management',
				icon: '/images/icons/schedule.png',
			},
			{
				name: 'Nhập TKB',
				url: '/import-timetable',
				icon: '/images/icons/Import.png',
			},
		],
	},
	{
		category: 'Lớp học',
		items: [
			{
				name: 'Lớp đơn',
				url: '/class-management',
				icon: '/images/icons/classroom.png',
			},
			{
				name: 'Lớp ghép',
				url: '/combine-class-management',
				icon: '/images/icons/training.png',
			},
			{
				name: 'Nhóm lớp',
				url: '/class-group-management',
				icon: '/images/icons/multiple-users-silhouette.png',
			},
		],
	},
	{
		category: 'Giảng dạy',
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
		],
	},
	{
		category: 'Tổng quan',
		items: [
			{
				name: 'Khung chương trình',
				url: '/curiculumn-management',
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
				name: 'Phòng học',
				url: '/room-management',
				icon: '/images/icons/desk.png',
			},
			{
				name: 'Tòa nhà',
				url: '/building-management',
				icon: '/images/icons/building.png',
			},
		],
	},
	{
		category: 'Báo cáo',
		items: [
			{
				name: 'Đơn yêu cầu',
				url: '/request-management',
				icon: '/images/icons/Import.png',
			},
		],
	},
];

export interface IDropdownOption<T> {
	value: T;
	label: string;
}
export const TEACHER_SIDENAV = [
	{
		name: 'Thông tin chung',
	},
	{
		name: 'Chuyên môn giảng dạy ',
	},
];

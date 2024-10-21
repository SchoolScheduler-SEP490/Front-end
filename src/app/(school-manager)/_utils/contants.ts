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
			{
				name: 'Khung chương trình',
				url: '/curriculum',
				icon: '/images/icons/book.png',
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

export interface ISubject {
	id: number;
	'subject-name': string;
	abbreviation: string;
	'is-required': boolean;
	description: string;
	'total-slot-in-year': number;
	'slot-specialized': number;
	'create-date': string;
	'update-date': string;
	'is-deleted': boolean;
}

export interface ISubjectTableData {
	id: number;
	subjectName: string;
	subjectCode: string;
	subjectGroup: string;
	subjectType: string;
}

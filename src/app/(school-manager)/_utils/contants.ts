import { INavigation } from '@/utils/constants';

export interface ISMSidenav {
	category: string;
	items: INavigation[];
}

export const SM_SIDENAV: ISMSidenav[] = [
	{
		category: 'Đối tượng',
		items: [
			{ name: 'Lớp học', url: 'class-management' },
			{ name: 'Khung chương trình', url: 'curriculum' },
			{ name: 'Tiết học', url: 'lesson-management' },
			{ name: 'Phòng học', url: 'room-management' },
			{ name: 'Thời khóa biểu', url: 'timetable-management' },
			{ name: 'Giáo viên', url: 'teacher-management' },
			{ name: 'Môn học', url: 'subject-management' },
			{ name: 'Tổ hợp môn', url: 'subject-group-management' },
		],
	},
	{
		category: 'Hoạt động',
		items: [
			{ name: 'Phân công dạy', url: 'teaching-assignment' },
			{ name: 'Phân công GVCN', url: 'homeroom-assignment' },
			{ name: 'Ràng buộc hệ thống', url: 'system-constraint' },
			{ name: 'Nhập TKB', url: 'import-timetable' },
			{ name: 'Chuyển TKB sang năm học mới', url: 'migrate-timetable' },
		],
	},
];

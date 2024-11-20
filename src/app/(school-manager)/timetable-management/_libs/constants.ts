import { IDropdownOption } from '../../_utils/contants';

export const TIMETABLE_GENERATION_TABS: IDropdownOption<string>[] = [
	{ label: 'Phân công giáo viên', value: 'teaching-assignment' },
	{ label: 'Tạo ràng buộc', value: 'constraints' },
	{ label: 'Sắp Thời khóa biểu', value: 'timetable-configuration' },
	{ label: 'Xem/Sửa Thời khóa biểu', value: 'timetable-adjustment' },
	{ label: 'Xuất/Công bố Thời khóa biểu', value: 'timetable-export' },
];

// Phân công giáo viên
export interface ITeachingAssignmentObject {
	id: number;
	'teacher-id': number;
}

// Tiết cố định
export interface IFixedPeriodObject {
	'subject-id': number;
	'class-id': number;
	'start-at': number;
}

// Tiết không xếp
export interface INoAssignPeriodObject {
	'start-at': number;
	'class-id': number;
	'teacher-id': number;
	'subject-id': number;
}

// Tiết rảnh
export interface IFreePeriodObject {
	'start-at': number;
	'class-id': number;
}

export interface IClassCombinationObject {
	'subject-id': number;
	'class-ids': number[];
	'room-id': number;
	session: string;
}

export interface IDataStoreObject {
	id?: string;
	'school-id': number;
	'year-id': number;
	'term-id': number;
	'schedule-id': number;
	'max-period-per-session': number;
	'min-period-per-session': number;
	'applied-curriculum-id': number;
	'teacher-assignments': ITeachingAssignmentObject[];
	'fixed-periods-para': IFixedPeriodObject[];
	'no-assign-periods-para': INoAssignPeriodObject[];
	'free-timetable-periods-para': IFreePeriodObject[];
	'class-combinations': IClassCombinationObject[];
}

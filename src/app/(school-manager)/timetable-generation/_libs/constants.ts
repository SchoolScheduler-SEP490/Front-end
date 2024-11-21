import { IDropdownOption } from '../../_utils/contants';

export const TIMETABLE_GENERATION_TABS: IDropdownOption<string>[] = [
	{ label: 'Gộp nhiều lớp chung tiết', value: 'class-combination' },
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
	'room-id'?: number;
	session: EClassSession;
	'teacher-id': number | null;
}

export enum EClassSession {
	Morning = 'Morning',
	Afternoon = 'Afternoon',
}

export interface IConfigurationStoreObject {
	id?: string;
	'timetable-id': string;
	'max-period-per-session': number;
	'min-period-per-session': number;
	'applied-curriculum-id': number;
	'teacher-assignments': ITeachingAssignmentObject[];
	'fixed-periods-para': IFixedPeriodObject[];
	'no-assign-periods-para': INoAssignPeriodObject[];
	'free-timetable-periods-para': IFreePeriodObject[];
	'class-combinations': IClassCombinationObject[];
}

export interface ITimetableStoreObject {
	id?: string;
	'timetable-name': string;
	'timetable-abbreviation': string;
	'school-id': number;
	'year-id': number;
	'term-id': number;
	'config-id': string;
	status: ETimetableStatus;
}

export enum ETimetableStatus {
	Published = 'Công bố',
	Pending = 'Chờ duyệt',
	Inactived = 'Vô hiệu',
}

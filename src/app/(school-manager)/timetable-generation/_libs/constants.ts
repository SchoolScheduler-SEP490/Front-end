import { IDropdownOption } from '../../_utils/contants';

export const TIMETABLE_GENERATION_TABS: IDropdownOption<string>[] = [
	{ label: 'Thông tin chung', value: 'information' },
	// { label: 'Cấu hình chung', value: 'general-configurations' },
	{ label: 'Cấu hình ràng buộc', value: 'constraints' },
	{ label: 'Phân công giáo viên', value: 'teaching-assignment' },
	{ label: 'Giáo viên - Tiết học', value: 'teachers-lessons' },
	{ label: 'Tạo thời khóa biểu', value: 'timetable-generation' },
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
	'fixed-periods-para': IFixedPeriodObject[];
	'no-assign-periods-para': INoAssignPeriodObject[];
	'free-timetable-periods-para': IFreePeriodObject[];
	'teacher-assignments': ITeachingAssignmentObject[];
	'class-combinations': IClassCombinationObject[];
	'max-period-per-session': number;
	'min-period-per-session': number;
	'applied-curriculum-id': number;
	'required-break-periods': number;
	'minimum-days-off': number;
	'days-in-week': number;
}

export interface ITimetableStoreObject {
	id?: string;
	'timetable-name': string;
	'timetable-abbreviation': string;
	'school-id': number;
	'year-id': number;
	'year-name': string;
	'term-name': string;
	'term-id': number;
	'config-id': string;
	'applied-week': number | null;
	'ended-week': number | null;
	status: ETimetableStatus;
}

export enum ETimetableStatus {
	Published = 'Công bố',
	Pending = 'Chờ duyệt',
	Inactived = 'Vô hiệu',
}

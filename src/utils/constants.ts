import { WhereFilterOp } from 'firebase/firestore';

export interface INavigation {
	name: string;
	url: string;
}

export interface IUser {
	id: string;
	email: string;
	role: string;
	jwt: IJWT;
}

export interface IJWT {
	token: string;
	refreshToken: string;
	expired: Date;
}

export const publicPaths = ['/landing', '/community', '/contact', '/schools', '/schedules'];
export const authPaths = ['/login', '/register', '/forgot-password'];
export const adminPaths = ['/dashboard'];
export const teacherPaths = ['/published-timetable'];
export const schoolManagerPaths = [
	'/timetable-management',
	'/teacher-management',
	'/subject-management',
	'/subject-group-management',
	'/lesson-management',
	'/class-management',
	'/room-management',
	'/curriculum',
	'/teaching-assignments',
	'/homeroom-assignments',
	'/system-constraints',
	'/import-timetable',
	'/migrate-timetable',
];

export interface ICommonResponse<T = any> {
	status: number;
	message: string;
	result: T;
}

export interface IPaginatedResponse<T> extends ICommonResponse {
	result: {
		'total-item-count': number;
		'page-size': number;
		'total-pages-count': number;
		'page-index': number;
		next: boolean;
		previous: boolean;
		items: T[];
	};
}

export interface ICommonOption {
	img: string;
	title: string;
}

export interface ISchoolYearResponse {
	id: number;
	'start-year': string;
	'end-year': string;
	'school-year-code': string;
}

export interface ITermResponse {
	id: number;
	name: string;
	'start-week': number;
	'end-week': number;
	'school-year-id': number;
	'school-year-code': string;
	'school-year-start': string;
	'school-year-end': string;
}

export const SUBJECT_GROUP_TYPE: { key: string; value: number }[] = [
	{ key: '', value: -1 },
	{ key: 'TN', value: 0 },
	{ key: 'XH', value: 1 },
	{ key: 'CN_VA_MT', value: 2 },
	{ key: 'BAT_BUOC', value: 3 },
	{ key: 'TU_CHON', value: 4 },
];

export const CLASSGROUP_STRING_TYPE: { key: string; value: number }[] = [
	{ key: 'Khối 10', value: 10 },
	{ key: 'Khối 11', value: 11 },
	{ key: 'Khối 12', value: 12 },
];

export const CLASSGROUP_TRANSLATOR: { [key: string]: number } = {
	GRADE_10: 10,
	GRADE_11: 11,
	GRADE_12: 12,
};
export const CLASSGROUP_TRANSLATOR_REVERSED: { [key: number]: string } = {
	10: 'GRADE_10',
	11: 'GRADE_11',
	12: 'GRADE_12',
};

export enum ERoomType {
	PRACTICE_ROOM = 'PRACTICE_ROOM',
	LECTURE_ROOM = 'LECTURE_ROOM',
}

export const ROOM_STRING_TYPE: { key: string; value: number }[] = [
	{ key: 'PRACTICE_ROOM', value: 1 },
	{ key: 'LECTURE_ROOM', value: 2 },
];

export const ROOM_TYPE_TRANSLATOR: { [key: string]: string } = {
	PRACTICE_ROOM: 'Phòng thực hành',
	LECTURE_ROOM: 'Phòng học lý thuyết',
};

export const TEACHER_STATUS: { key: string; value: number }[] = [
	{ key: 'HoatDong', value: 1 },
	{ key: 'CongTac', value: 2 },
	{ key: 'HauSan', value: 3 },
	{ key: 'DinhChi', value: 4 },
	{ key: 'NgungHoatDong', value: 5 },
];

export const TEACHER_STATUS_TRANSLATOR: { [key: number]: string } = {
	1: 'Hoạt động',
	2: 'Công tác',
	3: 'Hậu sản',
	4: 'Định chỉ',
	5: 'Ngừng hoạt động',
};

export const TEACHER_ROLE: { key: string; value: number }[] = [
	{ key: 'TEACHER', value: 1 },
	{ key: 'TEACHER_DEPARTMENT_HEAD', value: 2 },
];

export const TEACHER_ROLE_TRANSLATOR: { [key: number]: string } = {
	1: 'Giáo viên',
	2: 'Trưởng bộ môn',
};

export const SUBJECT_ABBREVIATION: { [key: string]: string } = {
	'Ngữ văn': 'Văn',
	Toán: 'Toán',
	'Ngoại ngữ 1': 'NN1',
	'Lịch sử': 'Sử',
	'Giáo dục thể chất': 'GDTC',
	'Giáo dục quốc phòng và an ninh': 'QPAN',
	'Địa lí': 'Địa',
	'Giáo dục kinh tế và pháp luật': 'GDPL',
	'Vật lí': 'Lý',
	'Hóa học': 'Hóa',
	'Sinh học': 'Sinh',
	'Công nghệ': 'CN',
	'Tin học': 'Tin',
	'Âm nhạc': 'Nhạc',
	'Mỹ thuật': 'M.thuật',
	'Hoạt động trải nghiệm, hướng nghiệp': 'HĐTN',
	'Nội dung giáo dục của địa phương': 'GDĐP',
	'Tiếng dân tộc thiểu số': 'Tiếng DTTS',
	'Ngoại ngữ 2': 'NN2',
	'Sinh Hoạt Dưới Cờ': 'SHDC',
};

export const TEACHER_GENDER: { key: string; value: number }[] = [
	{ key: 'Male', value: 1 },
	{ key: 'Female', value: 2 },
];

export const TEACHER_GENDER_TRANSLATOR: { [key: number]: string } = {
	1: 'Nam',
	2: 'Nữ',
};

export const ROOM_SUBJECT_MODEL: { key: string, value: number }[] = [
	{ key: 'Full', value: 1},
	{ key: 'NotFull', value: 2}
]

export const MAIN_SESSION: { key: string, value: number }[] = [
	{ key: 'Morning', value: 1 },
	{ key: 'Afternoon', value: 2 },
]

export const MAIN_SESSION_TRANSLATOR: { [key: number]: string } = {
	1: 'Buổi sáng',
	2: 'Buổi chiều',
};

export interface QueryCondition {
	field: string;
	operator: WhereFilterOp;
	value: any;
}

export const APPROPRIATE_LEVEL: { key: number; value: string }[] = [
	{ key: 1, value: ' Unqualified' },
	{ key: 2, value: 'Basic' },
	{ key: 3, value: 'Proficient' },
	{ key: 4, value: 'Advanced' },
	{ key: 5, value: 'Mastery' },
];

export const TIMETABLE_SLOTS = [
	{ period: 'Sáng', slots: ['Tiết 1', 'Tiết 2', 'Tiết 3', 'Tiết 4', 'Tiết 5'] },
	{ period: 'Chiều', slots: ['Tiết 6', 'Tiết 7', 'Tiết 8', 'Tiết 9', 'Tiết 10'] },
];

export const WEEK_DAYS = ['T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7'];
export const WEEK_DAYS_FULL = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

// =============================================TIMETABLE CONSTANTS===================================================
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
	'class-id': number | null;
	'teacher-id': number;
	'subject-id': number | null;
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

// Interface của cấu hình đi cùng với thời khóa biểu bên dưới
export interface IConfigurationStoreObject {
	id?: string;
	'timetable-id': string;
	'fixed-periods-para': IFixedPeriodObject[];
	'no-assign-periods-para': INoAssignPeriodObject[];
	'free-timetable-periods-para': IFreePeriodObject[];
	'teacher-assignments': ITeachingAssignmentObject[];
	'class-combinations': IClassCombinationObject[];
	'applied-curriculum-id': number;
	'required-break-periods': number;
	'minimum-days-off': number;
	'days-in-week': number;
}

// Interface của record thời khóa biểu
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
	// Id của thời khóa biểu đã tạo.
	'generated-schedule-id': string | null;
	'applied-week': number | null;
	'ended-week': number | null;
	status: ETimetableStatus;
}

export enum ETimetableStatus {
	Published = 'Công bố',
	Pending = 'Chờ duyệt',
	Inactived = 'Vô hiệu',
}

// Record kết quả generate thời khóa biểu
export interface IScheduleResponse {
	id: number;
	'school-year-id': number;
	'start-week': number;
	'end-week': number;
	'school-id': number;
	'term-id': number;
	'term-name': string | null;
	name: string;
	'fitness-point': number;
	'class-schedules': IClassSchedule[];
	'create-date': string;
	'update-date': string | null;
	'is-deleted': boolean;
}

export interface IClassSchedule {
	'school-schedule-id': number;
	'student-class-id': number;
	'student-class-name': string;
	'class-periods': IClassPeriod[];
	id: number;
	'create-date': string;
	'update-date': string | null;
	'is-deleted': boolean;
}

export interface IClassPeriod {
	'class-schedule-id': number | null;
	'room-id': number | null;
	'room-code': string | null;
	'teacher-id': number;
	'subject-id': number;
	'date-of-week': number;
	'subject-abbreviation': string;
	'teacher-abbreviation': string;
	'teacher-assignment-id': number;
	'start-at': number;
	priority: string;
	id: number;
	'create-date': string;
	'update-date': string | null;
	'is-deleted': boolean;
}

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
};

export const TEACHER_GENDER: { key: string; value: number }[] = [
	{ key: 'Male', value: 1 },
	{ key: 'Female', value: 2 },
];

export const TEACHER_GENDER_TRANSLATOR: { [key: number]: string } = {
	1: 'Nam',
	2: 'Nữ',
};
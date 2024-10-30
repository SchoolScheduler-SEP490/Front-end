import { StyledString } from "next/dist/build/swc";

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

export const publicPaths = [
	'/landing',
	'/community',
	'/contact',
	'/schools',
	'/schedules',
];
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
	PRACTICE_ROOM = "PRACTICE_ROOM",
	LECTURE_ROOM = "LECTURE_ROOM"
  }
  
  export const ROOM_STRING_TYPE: { key: string; value: number }[] = [
	{ key: 'PRACTICE_ROOM', value: 1 },
	{ key: 'LECTURE_ROOM', value: 2 },
  ];
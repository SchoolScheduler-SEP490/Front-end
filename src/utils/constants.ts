import exp from 'constants';

export interface INavList {
	name: string;
	url: string;
}

export const NAV_LINKS: INavList[] = [
	{
		name: 'Trang chủ',
		url: '/',
	},
	{
		name: 'Thời khóa biểu',
		url: '/timetable',
	},
	{
		name: 'Trường học',
		url: '/schools',
	},
	{
		name: 'Cộng đồng',
		url: '/community',
	},
	{
		name: 'Liên hệ',
		url: '/contact',
	},
];

export interface ILoginUser {
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

export interface ILoginResponse {
	status: number;
	message: string;
	'jwt-token': string;
	expired: Date;
	'jwt-refresh-token': string;
	'account-id': string;
}

export interface IJWTTokenPayload {
	email: string;
	accountId: string;
	jti: string;
	role: string;
	exp: number;
	iss: string;
	aud: string;
}

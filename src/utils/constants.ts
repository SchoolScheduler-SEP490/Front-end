import exp from 'constants';

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

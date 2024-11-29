export interface ILoginForm {
	email: string;
	password: string;
}

export interface ILoginResponse {
	status: number;
	message: string;
	'jwt-token': string | null;
	expired: Date | null;
	'jwt-refresh-token': string | null;
}

export interface IJWTTokenPayload {
	email: string;
	accountId: string;
	schoolId: string;
	schoolName: string;
	jti: string;
	role: string;
	exp: number;
	iss: string;
	aud: string;
}

export interface IRegisterForm {
	"school-id": number,
	email: string,
	phone: string,
	password: string,
	"confirm-account-password": string
}
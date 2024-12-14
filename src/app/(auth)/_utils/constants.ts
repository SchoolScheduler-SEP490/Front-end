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
	role: string | string[];
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

export const USER_ROLE_TRANSLATOR: { [key: string]: string } = {
	'Teacher': 'Giáo viên',
	'TeacherDepartmentHead': 'Trưởng bộ môn',
	'Admin': 'Quản trị viên',
	'SchoolManager': 'Quản lý trường',
}
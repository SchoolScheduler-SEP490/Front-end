export interface ILogoutReqBody {
	sessionToken: string;
}

export interface IRefreshReqBody {
	refreshToken: string;
}

export interface IRefreshTokenPayload {
	email: string;
	exp: Date;
}

export interface IRefreshTokenResponse {
	status: number;
	message: string;
	'jwt-token': string;
	expired: string;
	'jwt-refresh-token': string;
}

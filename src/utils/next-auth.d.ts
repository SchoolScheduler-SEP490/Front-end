import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import ILoginUser from './constants';

declare module 'next-auth/jwt' {
	interface JWT {
		access_token: string;
		refresh_token: string;
		user: ILoginUser;
		access_expire: number;
		error: string;
	}
}

declare module 'next-auth' {
	interface Session {
		user: ILoginUser;
		access_token: string;
		refresh_token: string;
		access_expire: number;
		error: string;
	}
}

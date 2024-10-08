import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { pages } from 'next/dist/build/templates/app-page';
import ILoginUser from './utils/constants';

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			credentials: {
				email: {},
				password: {},
			},
			authorize: async (credentials) => {
				console.log('Credentials: ', credentials);
				let user = null;

				// Implementing Signin function or validating function here

				// user = {
				// 	id: '1',
				// 	name: 'Test User',
				// 	email: 'something',
				// 	role: 'admin',
				// };

				if (!user) {
					// No user found, so this is their first attempt to login
					// meaning this is also the place you could do registration
					throw new Error('User not found.');
				}

				console.log('User:', user);
				// return user object with their profile data
				return user;
			},
		}),
	],
	pages: {
		signIn: '/login',
		newUser: '/register',
		error: '/',
	},
});

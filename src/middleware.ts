import { jwtDecode } from 'jwt-decode';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { IJWTTokenPayload } from './app/(auth)/_utils/constants';

const publicPaths = ['/landing', '/community', '/contact', '/schools', '/schedules'];
const authPaths = ['/login', '/register', '/forgot-password'];
const adminPaths = ['/dashboard'];
const teacherPaths = ['/published-timetable'];
const schoolManagerPaths = [
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

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const sessionToken = request.cookies.get('sessionToken')?.value;

	if (!sessionToken) {
		if (
			[...adminPaths, ...teacherPaths, ...schoolManagerPaths].some((path) =>
				pathname.startsWith(path)
			)
		) {
			return NextResponse.redirect('/landing');
		}
		// return NextResponse.rewrite(new URL('/404', request.url), { status: 404 });
	} else {
		try {
			if (
				[...authPaths, ...publicPaths].some((path) => pathname.startsWith(path))
			) {
				return NextResponse.redirect('/');
			}

			const data = jwtDecode(sessionToken);
			const userRole = (data as IJWTTokenPayload).role;

			// Admin routes
			if (userRole.toLowerCase() === 'admin') {
				if (!adminPaths.some((path) => pathname.startsWith(path)))
					return NextResponse.redirect(adminPaths[0]);
			}

			// Teacher routes
			else if (userRole.toLowerCase() === 'teacher') {
				if (!teacherPaths.some((path) => pathname.startsWith(path)))
					return NextResponse.redirect(teacherPaths[0]);
			}

			// Teacher Department Head routes
			else if (userRole.toLowerCase() === 'teacher') {
				if (!teacherPaths.some((path) => !pathname.startsWith(path)))
					return NextResponse.redirect(teacherPaths[0]);
			}

			// School Manager routes
			else if (userRole.toLowerCase() === 'schoolmanager') {
				if (!schoolManagerPaths.some((path) => pathname.startsWith(path)))
					return NextResponse.redirect(schoolManagerPaths[0]);
			}
		} catch (e: any) {
			//Do something with the error
		}
	}
	return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: Array.from([
		...authPaths,
		...publicPaths,
		...adminPaths,
		...teacherPaths,
		...schoolManagerPaths,
	]),
};

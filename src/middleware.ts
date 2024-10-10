import { jwtDecode } from 'jwt-decode';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { IJWTTokenPayload } from './app/(auth)/_utils/constants';

const publicPaths = ['/landing', '/community', '/contact', '/schools', 'timetable'];
const authPaths = ['/login', '/register', '/forgot-password'];
const adminPaths = ['/dashboard'];
const teacherPaths = ['/published-timetable'];
const schoolManagerPaths = ['/timetable'];

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
			return NextResponse.redirect(new URL('/landing', request.url));
		}
		// return NextResponse.rewrite(new URL('/404', request.url), { status: 404 });
	} else {
		if ([...authPaths, ...publicPaths].some((path) => pathname.startsWith(path))) {
			return NextResponse.redirect(new URL('/', request.url));
		}

		const data = jwtDecode(sessionToken);
		const userRole = (data as IJWTTokenPayload).role;
		// Admin routes
		if (userRole.toLowerCase() === 'admin') {
			if (adminPaths.some((path) => !pathname.startsWith(path)))
				return NextResponse.redirect(new URL('/dashboard', request.url));
		}
		// Teacher and Teacher Department Head routes
		else if (
			userRole.toLowerCase() === 'teacher' ||
			userRole.toLowerCase() === 'teacherheaddepartment'
		) {
			if (teacherPaths.some((path) => !pathname.startsWith(path)))
				return NextResponse.redirect(
					new URL('/published-timetable', request.url)
				);
		}
		// School Manager routes
		else if (userRole.toLowerCase() === 'schoolmanager') {
			if (schoolManagerPaths.some((path) => !pathname.startsWith(path)))
				return NextResponse.redirect(new URL('/timetable', request.url));
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

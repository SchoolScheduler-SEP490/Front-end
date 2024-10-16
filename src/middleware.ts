import { jwtDecode } from 'jwt-decode';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { IJWTTokenPayload } from './app/(auth)/_utils/constants';
import {
	adminPaths,
	authPaths,
	publicPaths,
	schoolManagerPaths,
	teacherPaths,
} from './utils/constants';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const sessionToken = request.cookies.get('sessionToken')?.value;

	if (!sessionToken) {
		//--> Nếu chưa đăng nhập thì không thể vào các trang private
		if (
			// Nếu đường dẫn không bắt đầu bằng các đường dẫn public hoặc auth thì 404
			[...schoolManagerPaths, ...teacherPaths, ...adminPaths].some((path) =>
				pathname.startsWith(path)
			)
		) {
			return NextResponse.redirect(request.nextUrl, { status: 404 });
		}
		// return NextResponse.rewrite(new URL('/404', request.url), { status: 404 });
	} else {
		//---> Nếu đã đăng nhập thì kiểm tra role để xác định đường dẫn
		try {
			const data = jwtDecode(sessionToken);
			const userRole = (data as IJWTTokenPayload).role;

			switch (userRole.toLowerCase()) {
				// Nếu là school manager thì chỉ được vào các trang school manager
				case 'schoolmanager':
					if (
						pathname === '/' ||
						[...publicPaths, ...authPaths].some((path) =>
							pathname.startsWith(path)
						)
					) {
						return NextResponse.redirect(schoolManagerPaths[0]);
					} else if (
						schoolManagerPaths.some((path) => pathname.startsWith(path))
					) {
						return NextResponse.next();
					} else {
						return NextResponse.redirect(request.nextUrl, { status: 404 });
					}
				// Nếu là admin thì chỉ được vào các trang admin
				case 'admin':
					if (
						pathname === '/' ||
						[...publicPaths, ...authPaths].some((path) =>
							pathname.startsWith(path)
						)
					) {
						return NextResponse.redirect(adminPaths[0]);
					} else if (adminPaths.some((path) => pathname.startsWith(path))) {
						return NextResponse.next();
					} else {
						return NextResponse.redirect(request.nextUrl, { status: 404 });
					}
				// Nếu là giáo viên thì chỉ được vào các trang giáo viên
				case 'teacher':
					if (
						pathname === '/' ||
						[...publicPaths, ...authPaths].some((path) =>
							pathname.startsWith(path)
						)
					) {
						return NextResponse.redirect(teacherPaths[0]);
					} else if (teacherPaths.some((path) => pathname.startsWith(path))) {
						return NextResponse.next();
					} else {
						return NextResponse.redirect(request.nextUrl, { status: 404 });
					}
				// Nếu là trưởng bộ môn thì chỉ được vào các trang trưởng bộ môn
				case 'teacherdepartmenthead':
					if (
						pathname === '/' ||
						[...publicPaths, ...authPaths].some((path) =>
							pathname.startsWith(path)
						)
					) {
						return NextResponse.redirect(teacherPaths[0]);
					} else if (teacherPaths.some((path) => pathname.startsWith(path))) {
						return NextResponse.next();
					} else {
						return NextResponse.redirect(request.nextUrl, { status: 404 });
					}
				default:
					// Các trường hợp còn lại thì quy đồng về cái này
					return NextResponse.redirect('/');
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

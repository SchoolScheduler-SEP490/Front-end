import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const privatePaths = ['/landing'];
const authPaths = ['/login', '/register'];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const sessionToken = request.cookies.get('sessionToken')?.value;

	// Chưa đăng nhập thì không cho vào private paths
	if (privatePaths.some((path) => pathname.startsWith(path)) && !sessionToken) {
		return NextResponse.redirect(new URL('/login', request.url));
	}
	// Đăng nhập rồi thì không cho vào login/register nữa
	if (authPaths.some((path) => pathname.startsWith(path)) && sessionToken) {
		return NextResponse.rewrite(new URL('/404', request.url), { status: 404 });
	}
	return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: ['/login', '/register', '/landing'],
};

import { ILogoutReqBody } from '../_utils/constants';

export async function POST(request: Request) {
	const res = await request.json();
	const logoutBody: ILogoutReqBody = { ...res };
	const sessionToken: string = logoutBody?.sessionToken ?? undefined;

	if (!sessionToken) {
		return Response.json(
			{ message: 'Không nhận được session token' },
			{
				status: 400,
			}
		);
	}

	return Response.json(
		{ message: 'Đã đăng xuất' },
		{
			status: 200,
			headers: {
				'Set-Cookie': [
					'sessionToken=; HttpOnly; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
					'refreshToken=; HttpOnly; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
					'userRole=; HttpOnly; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
					// Add other cookies you want to remove here
				].join(','),
			},
		}
	);
}

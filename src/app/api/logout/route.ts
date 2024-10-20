import { ILogoutReqBody } from '../_utils/constants';

export async function POST(request: Request) {
	const res = await request.json();
	const logoutBody: ILogoutReqBody = { ...res };
	const sessionToken: string = logoutBody.sessionToken ?? undefined;

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
					'sessionToken=; HttpOnly; Path=/; Max-Age=0',
					'refreshToken=; HttpOnly; Path=/; Max-Age=0',
					// Add other cookies you want to remove here
				].join(','),
			},
		}
	);
}

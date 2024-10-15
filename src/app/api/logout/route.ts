import { ILogoutReqBody } from '../_utils/constants';

export async function POST(request: Request) {
	const res = await request.json();
	const logoutBody: ILogoutReqBody = { ...res };
	const sessionToken: string = logoutBody.sessionToken ?? undefined;
	const refreshToken: string = logoutBody.refreshToken ?? undefined;

	if (!sessionToken) {
		return Response.json(
			{ message: 'Không nhận được session token' },
			{
				status: 400,
			}
		);
	}

	return Response.json(res, {
		status: 200,
		headers: {
			'Set-Cookie': `sessionToken=;refreshToken=; Path=/; HttpOnly`,
		},
	});
}

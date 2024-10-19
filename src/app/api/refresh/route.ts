import { jwtDecode } from 'jwt-decode';
import { IRefreshReqBody, IRefreshTokenResponse } from '../_utils/constants';

export async function POST(request: Request) {
	const req = await request.json();
	const requestBody: IRefreshReqBody = { ...req };
	const refreshToken = requestBody.refreshToken ?? undefined;
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;

	if (!refreshToken) {
		return Response.json(
			{ message: 'Không nhận được session token' },
			{
				status: 400,
			}
		);
	} else {
		const data = jwtDecode(refreshToken);
		const expireDate = new Date((data.exp ?? 0) * 1000);
		if (expireDate < new Date()) {
			return Response.json(
				{ message: 'Phiên đăng nhập hết hạn: ' + expireDate.toString() },
				{
					status: 440,
				}
			);
		} else {
			const data = await fetch(
				`${apiUrl}/api/users/refresh-token?refreshToken=${refreshToken}`,
				{ method: 'POST', headers: { 'Content-Type': 'application/json' } }
			);
			if (data.status !== 200) {
				return Response.json({ message: 'Lỗi khi lấy dữ liệu' }, { status: 500 });
			}
			const response: IRefreshTokenResponse = await data.json();
			if (response['jwt-token'] && response['jwt-refresh-token']) {
				return Response.json(response, {
					status: 200,
					headers: {
						'Set-Cookie': [
							`sessionToken=${response['jwt-token']}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=900`,
							`refreshToken=${response['jwt-refresh-token']}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=2592000`,
						].join(','),
					},
				});
			}
		}
	}
}

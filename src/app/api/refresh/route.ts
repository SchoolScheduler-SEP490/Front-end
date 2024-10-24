import { jwtDecode } from 'jwt-decode';
import { IRefreshReqBody, IRefreshTokenResponse } from '../_utils/constants';

export async function POST(request: Request) {
	const req = await request.json();
	const requestBody: IRefreshReqBody = { ...req };
	const refreshToken = requestBody.refreshToken ?? undefined;
	const userRole = requestBody.role ?? undefined;
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;

	if (!refreshToken || !userRole) {
		return Response.json(
			{ message: 'Không nhận được dữ liệu' },
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
			const responseData = await fetch(
				`${apiUrl}/api/users/refresh-token?refreshToken=${refreshToken}`,
				{ method: 'POST', headers: { 'Content-Type': 'application/json' } }
			);
			if (responseData.status !== 200) {
				return Response.json({ message: 'Lỗi khi lấy dữ liệu' }, { status: 500 });
			}
			const response: IRefreshTokenResponse = {
				...(await responseData.json()),
				userRole: userRole,
			};
			if (response['jwt-token'] && response['jwt-refresh-token']) {
				return Response.json(response, {
					status: 200,
					headers: {
						'Set-Cookie': [
							`sessionToken=${response['jwt-token']}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=900`,
							`refreshToken=${response['jwt-refresh-token']}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=2592000`,
							`userRole=${userRole}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=2592000`,
						].join(','),
					},
				});
			}
		}
	}
}

export async function POST(request: Request) {
	return Response.json(
		{ message: 'Đã đăng xuất' },
		{
			status: 200,
			headers: {
				'Set-Cookie': [
					'sessionToken=; HttpOnly; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
					'refreshToken=; HttpOnly; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
					'userRole=; HttpOnly; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
					'selectedSchoolYearId=; HttpOnly; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
					// Add other cookies you want to remove here
				].join(','),
			},
		}
	);
}

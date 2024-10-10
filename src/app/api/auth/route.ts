export async function POST(request: Request) {
	const res = await request.json();
	console.log('>>>Response: ', JSON.stringify(res, null, 2));
	const sessionToken = res?.jwt?.token ?? undefined;

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
			'Set-Cookie': `sessionToken=${sessionToken}; Path=/; HttpOnly`,
		},
	});
}

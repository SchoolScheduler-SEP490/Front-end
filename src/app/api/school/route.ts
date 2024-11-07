export async function POST(request: Request) {
	const req = await request.json();
	const requestBody: { schoolYearId: number } = { ...req };
	const schoolYearId = requestBody.schoolYearId ?? 0;

	if (schoolYearId !== 0) {
		return Response.json('Cập nhật năm học thành công', {
			status: 200,
			headers: {
				'Set-Cookie': [
					`selectedSchoolYearId=${schoolYearId}; HttpOnly; Secure; Path=/; SameSite=Lax`,
				].join(','),
			},
		});
	}
	return Response.json('Cập nhật năm học thất bại', { status: 400 });
}

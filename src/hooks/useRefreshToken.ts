async function fetchWithToken(url: string, token: string) {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ refreshToken: token }),
	});
	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.message || 'Không thể làm mới token');
	}
	return data;
}

export default fetchWithToken;

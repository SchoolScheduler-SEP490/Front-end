const api = process.env.NEXT_PUBLIC_API_URL;

export const getApplication = async (
    id: number,
    schoolYearId: number,
    sessionToken: string
) => {
    const response= await fetch (`${api}/api/submit-requests/teacher/${id}?schoolYearId=${schoolYearId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`
        }
    })
    const data = await response.json();
    return data;
}
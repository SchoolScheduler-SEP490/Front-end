const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getFetchRequestsApi = ({
	schoolYearId,
	status,
}: {
	schoolYearId: number;
	status: 'Pending' | 'Approved' | 'Rejected';
}) => {
	return `${api}/api/submit-requests?schoolYearId=${schoolYearId}&eRequestStatus=${status}`;
};

export const getUpdateRequestApi = (id: number) => {
	return `${api}/api/submit-requests/${id}`;
};

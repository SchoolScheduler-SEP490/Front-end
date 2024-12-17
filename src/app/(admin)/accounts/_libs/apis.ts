const api: string = process.env.NEXT_PUBLIC_API_URL ?? 'Unknown';

export const getFetchAccountApi = ({
	accountStatus,
	pageIndex,
	pageSize,
}: {
	accountStatus?: string;
	pageIndex: number;
	pageSize: number;
}) => {
	return `${api}/api/accounts?${
		accountStatus ? `accountStatus=${accountStatus}` : ''
	}&pageIndex=${pageIndex}&pageSize=${pageSize}`;
};

export const getActiveSchoolApi = ({
	accountStatus,
	schoolId,
	schoolManagerId,
}: {
	schoolManagerId: number;
	schoolId: number;
	accountStatus: 'Active' | 'Pending' | 'Inactive';
}) => {
	return `${api}/api/users/confirm-school-manager-account?schoolManagerId=${schoolManagerId}&schoolId=${schoolId}&accountStatus=${accountStatus}`;
};

export const getUpdateStatusSchoolApi = () => {
	return `${api}/api/users/status`;
};

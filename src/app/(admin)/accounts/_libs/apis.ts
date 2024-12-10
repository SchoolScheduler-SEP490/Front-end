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

export const getActiveSchoolApi = () => {
	return `${api}/api/users/status`;
};

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

export const getFetchSchoolApi = ({
	pageIndex,
	pageSize,
	districtCode,
	provinceId,
	schoolStatus,
}: {
	schoolStatus?: string;
	districtCode?: number;
	provinceId?: number;
	pageIndex: number;
	pageSize: number;
}) => {
	const queryString = new URLSearchParams({
		pageSize: pageSize.toString(),
		pageIndex: pageIndex.toString(),
		...(schoolStatus && { schoolStatus: schoolStatus.toString() }),
		...(districtCode && { districtCode: districtCode.toString() }),
		...(provinceId && { provinceId: provinceId.toString() }),
	}).toString();

	return `${api}/api/schools?${queryString}`;
};

export const getActiveSchoolApi = () => {
	return `${api}/api/users/status`;
};

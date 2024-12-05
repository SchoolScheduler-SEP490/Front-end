const api: string = process.env.NEXT_PUBLIC_API_URL ?? 'Unknown';

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

export const getFetchProvinceApi = ({
	pageIndex,
	pageSize,
	id,
}: {
	pageIndex: number;
	pageSize: number;
	id?: number;
}) => {
	return `${api}/api/provinces?pageIndex=${pageIndex}&pageSize=${pageSize}${id ? `&id=${id}` : ''}`;
};

export const getFetchDistrictApi = ({
	pageIndex,
	pageSize,
	provinceId,
}: {
	pageIndex: number;
	pageSize: number;
	provinceId: number;
}) => {
	return `${api}/api/districts/provinces/${provinceId}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
};

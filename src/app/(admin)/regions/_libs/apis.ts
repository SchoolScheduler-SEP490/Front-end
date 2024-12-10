const api: string = process.env.NEXT_PUBLIC_API_URL ?? 'Unknown';

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

export const getUpdateProvinceApi = (provinceId: number) => {
	return `${api}/api/provinces/${provinceId}`;
};

export const getUpdateDistrictApi = ({
	provinceId,
	districtCode,
}: {
	provinceId: number;
	districtCode: number;
}) => {
	return `${api}/${districtCode}/provinces/${provinceId}`;
};

export const getDeleteDistrictApi = ({
	provinceId,
	districtCode,
}: {
	provinceId: number;
	districtCode: number;
}) => {
	return `${api}/${districtCode}/provinces/${provinceId}`;
};

export const getCreateDistrictApi = (provinceId: number) => {
	return `${api}/api/districts/provinces/${provinceId}`;
};

export const getCreateProvinceApi = () => {
	return `${api}/api/provinces`;
};

'use client';
import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import AdminHeader from '@/commons/admin/header';
import { useAppContext } from '@/context/app_provider';
import { IAdminState } from '@/context/slice_admin';
import { useAdminSelector } from '@/hooks/useReduxStore';
import { useEffect, useState } from 'react';
import SchoolsFilterable from './_components/schools_filterable';
import SchoolsTable from './_components/schools_table';
import SchoolTableSkeleton from './_components/skeleton_table';
import useFetchDistricts from './_hooks/useFetchDistrict';
import useFetchProvinces from './_hooks/useFetchProvince';
import useFetchSchools from './_hooks/useFetchSchool';
import { IDistrictResponse, IProvinceResponse, ISchoolResponse } from './_libs/constants';

export default function RegisteredSchoolPage() {
	const { sessionToken } = useAppContext();
	const { isMenuOpen }: IAdminState = useAdminSelector((state) => state.admin);

	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);
	const [totalRows, setTotalRows] = useState<number | undefined>(undefined);

	const [isFilterableModalOpen, setIsFilterableModalOpen] = useState<boolean>(true);
	const [selectedDistricCode, setSelectedDistricCode] = useState<number>(0);
	const [selectedProvinceId, setSelectedProvinceId] = useState<number>(0);
	const [selectedSchoolStatus, setSelectedSchoolStatus] = useState<string>('All');

	const [schoolData, setSchoolData] = useState<ISchoolResponse[]>([]);
	const [provinceOptions, setProvinceOptions] = useState<IDropdownOption<number>[]>([]);
	const [districtOptions, setDistrictOptions] = useState<IDropdownOption<number>[]>([]);

	const { data: provinceData, mutate: updateProvince } = useFetchProvinces({
		pageIndex: 1,
		pageSize: 999999,
	});
	const { data: districtData, mutate: updateDistrict } = useFetchDistricts({
		pageIndex: 1,
		pageSize: 999999,
		provinceId: selectedProvinceId,
	});
	const {
		data: schoolResponse,
		mutate: updateSchool,
		isValidating: isSchoolValidating,
	} = useFetchSchools({
		sessionToken,
		pageIndex: page + 1,
		pageSize: rowsPerPage,
		...(selectedDistricCode !== 0 && { districtCode: selectedDistricCode }),
		...(selectedProvinceId !== 0 && { provinceId: selectedProvinceId }),
		...(selectedSchoolStatus !== 'All' && { schoolStatus: selectedSchoolStatus }),
	});

	useEffect(() => {
		setProvinceOptions([]);
		setDistrictOptions([]);
		updateProvince();
		updateDistrict();
		if (provinceData?.status === 200) {
			const tmpProvinceOptions: IDropdownOption<number>[] = provinceData.result.items.map(
				(item: IProvinceResponse) =>
					({
						label: item.name,
						value: item.id,
					} as IDropdownOption<number>)
			);

			setProvinceOptions(tmpProvinceOptions.sort((a, b) => a.label.localeCompare(b.label)));
		}
		if (districtData?.status === 200) {
			const tmpDistrictOptions: IDropdownOption<number>[] = districtData.result.items.map(
				(item: IDistrictResponse) =>
					({
						label: item.name,
						value: item['district-code'],
					} as IDropdownOption<number>)
			);
			setDistrictOptions(tmpDistrictOptions);
		}
	}, [provinceData, districtData, selectedProvinceId, open]);

	useEffect(() => {
		setSchoolData([]);
		updateSchool();
		if (schoolResponse?.status === 200) {
			setSchoolData(schoolResponse.result.items);
			setTotalRows(schoolResponse.result['total-item-count']);
		}
	}, [schoolResponse, page, rowsPerPage]);

	return (
		<div
			className={`w-[${
				!isMenuOpen ? '84' : '100'
			}%] h-screen flex flex-col justify-start items-start`}
		>
			<AdminHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>
						Quản lý người dùng
					</h3>
				</div>
			</AdminHeader>
			<div
				className={`w-full h-max pt-[3vh] ${
					isFilterableModalOpen
						? 'flex flex-row justify-between items-start px-[1vw] gap-[1vw]'
						: 'px-[5vw]'
				}`}
			>
				<div className='w-full h-max max-h-[90vh] overflow-y-scroll no-scrollbar p-1'>
					{isSchoolValidating ? (
						<SchoolTableSkeleton />
					) : (
						<SchoolsTable
							data={schoolData}
							page={page}
							setPage={setPage}
							rowsPerPage={rowsPerPage}
							setRowsPerPage={setRowsPerPage}
							totalRows={totalRows}
							setIsFilterableModalOpen={setIsFilterableModalOpen}
							mutate={updateSchool}
						/>
					)}
				</div>
				<SchoolsFilterable
					open={isFilterableModalOpen}
					setOpen={setIsFilterableModalOpen}
					selectedAccountStatus={selectedSchoolStatus}
					setSelectedAccountStatus={setSelectedSchoolStatus}
					selectedDistrictId={selectedDistricCode}
					selectedProvinceId={selectedProvinceId}
					setSelectedDistrictId={setSelectedDistricCode}
					setSelectedProvinceId={setSelectedProvinceId}
					districtOptions={districtOptions}
					provinceOptions={provinceOptions}
				/>
			</div>
		</div>
	);
}

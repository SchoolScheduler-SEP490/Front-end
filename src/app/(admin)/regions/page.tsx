'use client';
import { useEffect, useState } from 'react';
import useFetchDistricts from './_hooks/useFetchDistrict';
import useFetchProvinces from './_hooks/useFetchProvince';
import AdminHeader from '@/commons/admin/header';
import { IAdminState } from '@/context/slice_admin';
import { useAdminSelector } from '@/hooks/useReduxStore';
import { IDistrictResponse, IProvinceResponse } from './_libs/constants';
import RegionsTable from './_components/regions_table';
import RegionsFilterable from './_components/regions_filterable';

export default function RegionPage() {
	const { isMenuOpen }: IAdminState = useAdminSelector((state) => state.admin);

	const [isFilterableModalOpen, setIsFilterableModalOpen] = useState<boolean>(true);
	const [selectedProvinceId, setSelectedProvinceId] = useState<number>(0);

	const [provinceData, setProvinceData] = useState<IProvinceResponse[]>([]);
	const [districtData, setDistrictData] = useState<IDistrictResponse[]>([]);

	const { data: provinceResponse, mutate: updateProvince } = useFetchProvinces({
		pageIndex: 1,
		pageSize: 999999,
	});
	const {
		data: districtResponse,
		mutate: updateDistrict,
		isValidating: isDistrictValidating,
	} = useFetchDistricts({
		pageIndex: 1,
		pageSize: 999999,
		provinceId: selectedProvinceId,
	});

	useEffect(() => {
		updateProvince();
		if (provinceResponse?.status === 200) {
			setProvinceData(provinceResponse.result.items.sort((a, b) => a.name.localeCompare(b.name)));
		}
	}, [provinceResponse]);

	useEffect(() => {
		if (selectedProvinceId !== 0) {
			updateDistrict();
			if (districtResponse?.status === 200) {
				setDistrictData(districtResponse.result.items.sort((a, b) => a.name.localeCompare(b.name)));
			}
		}
	}, [districtResponse, selectedProvinceId]);

	return (
		<div
			className={`w-[${
				!isMenuOpen ? '84' : '100'
			}%] h-screen flex flex-col justify-start items-start`}
		>
			<AdminHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>Khu vực </h3>
				</div>
			</AdminHeader>
			<div
				className={`w-full h-max pt-[3vh] ${
					isFilterableModalOpen ? 'flex flex-row justify-evenly items-center' : 'px-[5vw]'
				}`}
			>
				<div className='w-full max-w-[60%] h-max max-h-[90vh] overflow-y-scroll no-scrollbar p-1'>
					<RegionsTable
						data={provinceData}
						selectedProvinceId={selectedProvinceId}
						setSelectedProvinceId={setSelectedProvinceId}
						districtData={districtData}
						isDistrictValidating={isDistrictValidating}
					/>
				</div>
				<RegionsFilterable
					open={isFilterableModalOpen}
					setOpen={setIsFilterableModalOpen}
					provinceData={provinceData}
					districtData={districtData}
					selectedProvinceId={selectedProvinceId}
					setSelectedProvinceId={setSelectedProvinceId}
				/>
			</div>
		</div>
	);
}

'use client';
import AdminHeader from '@/commons/admin/header';
import { IAdminState } from '@/context/slice_admin';
import useFetchSchoolYear from '@/hooks/useFetchSchoolYear';
import { useAdminSelector } from '@/hooks/useReduxStore';
import { ISchoolYearResponse } from '@/utils/constants';
import { useEffect, useState } from 'react';
import SchoolYearTable from './_components/schoolyears_table';
import SchoolYearTableSkeleton from './_components/skeleton_table';
import SchoolYearsFilterable from './_components/schoolyears_filterable';

export default function SchoolYearPage() {
	const { isMenuOpen }: IAdminState = useAdminSelector((state) => state.admin);

	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);
	const [totalRows, setTotalRows] = useState<number | undefined>(undefined);

	const [isFilterableModalOpen, setIsFilterableModalOpen] = useState<boolean>(true);

	const [schoolYearData, setSchoolYearData] = useState<ISchoolYearResponse[]>([]);

	const {
		data: schoolYearResponse,
		mutate: updateSchoolYear,
		isValidating,
	} = useFetchSchoolYear({
		includePrivate: true,
	});

	useEffect(() => {
		updateSchoolYear();
		setSchoolYearData([]);
		if (schoolYearResponse?.status === 200) {
			setSchoolYearData(schoolYearResponse.result);
		}
	}, [schoolYearResponse]);
	return (
		<div
			className={`w-[${
				!isMenuOpen ? '84' : '100'
			}%] h-screen flex flex-col justify-start items-start`}
		>
			<AdminHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>Năm học</h3>
				</div>
			</AdminHeader>
			<div
				className={`w-full h-max pt-[3vh] ${
					isFilterableModalOpen ? 'flex flex-row justify-evenly items-start' : 'px-[5vw]'
				}`}
			>
				<div className='w-full max-w-[65%] h-fit max-h-[90vh] overflow-y-scroll no-scrollbar p-1 flex flex-col justify-start items-center'>
					{isValidating ? (
						<SchoolYearTableSkeleton />
					) : (
						<SchoolYearTable
							data={schoolYearData}
							page={page}
							setPage={setPage}
							rowsPerPage={rowsPerPage}
							setRowsPerPage={setRowsPerPage}
							setIsFilterableModalOpen={setIsFilterableModalOpen}
						/>
					)}
				</div>
				<SchoolYearsFilterable
					open={isFilterableModalOpen}
					setOpen={setIsFilterableModalOpen}
					yearData={schoolYearData}
				/>
			</div>
		</div>
	);
}

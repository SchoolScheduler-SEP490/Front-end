'use client';

import SMHeader from '@/commons/school_manager/header';
import DepartmentTable from './_components/department_table';
import { useEffect, useState } from 'react';
import { IDepartmentResponse, IDepartmentTableData } from './_libs/constants';
import { useAppContext } from '@/context/app_provider';
import useFetchDepartment from './_hooks/useFetchDepartment';
import useNotify from '@/hooks/useNotify';
import { TRANSLATOR } from '@/utils/dictionary';
import DepartmentTableSkeleton from './_components/skeleton_table';
import DepartmentDetails from './_components/department_details';

export default function SMDepartment() {
	const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(5);
	const [totalRows, setTotalRows] = useState<number | undefined>(undefined);
	const [isErrorShown, setIsErrorShown] = useState<boolean>(false);
	const [departmentTableData, setDepartmentTableData] = useState<IDepartmentTableData[]>([]);
	const [selectedDepartmentId, setSelectedDepartmentId] = useState<number>(0);
	const [isDepartmentDetailsOpen, setIsDepartmentDetailsOpen] = useState<boolean>(false);

	const {
		data: departmentData,
		error: departmentError,
		isValidating: isDepartmentValidating,
		mutate: updateDepartment,
	} = useFetchDepartment({
		schoolId: Number(schoolId),
		sessionToken,
		pageIndex: page + 1,
		pageSize: rowsPerPage,
	});

	useEffect(() => {
		updateDepartment();
		setDepartmentTableData([]);
		if (departmentData?.status === 200) {
			const tmpDepartmentData: IDepartmentTableData[] = departmentData.result.items.map(
				(item: IDepartmentResponse) =>
					({
						id: item.id,
						departmentName: item.name,
						departmentCode: item['department-code'],
						description: item.description || '',
						departmentKey: item.id,
						meetingDay: item['meeting-day'] ? Number(item['meeting-day']) : 0,
						departmentHeadId: item['teacher-department-head-id'],
						departmentHeadName: `${item['teacher-department-first-name']} ${item['teacher-department-last-name']} (${item['teacher-department-abbreviation']})`,
					} as IDepartmentTableData)
			);
			setIsErrorShown(false);
			setDepartmentTableData(tmpDepartmentData);
			setTotalRows(departmentData.result['total-item-count']);
		}
	}, [departmentData, selectedSchoolYearId]);

	useEffect(() => {
		if (!isErrorShown) {
			if (departmentError) {
				useNotify({
					message: TRANSLATOR[departmentError.message] ?? 'Có lỗi xảy ra',
					type: 'error',
				});
				setIsErrorShown(true);
			}
		}
	}, [isDepartmentValidating]);

	if (isDepartmentValidating) {
		return (
			<div className='w-[84%] h-screen flex flex-col justify-start items-start'>
				<SMHeader>
					<div>
						<h3 className='text-title-small text-white font-semibold tracking-wider'>
							Thời khóa biểu
						</h3>
					</div>
				</SMHeader>
				<div className='w-full h-fit flex justify-center items-start overflow-hidden'>
					{/* Add more element here */}
					<div className='w-fit h-[90%] pt-[5vh] pb-[10vh] px-2 overflow-y-scroll no-scrollbar flex justify-center items-start'>
						<DepartmentTableSkeleton />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='w-[84%] h-screen flex flex-col justify-start items-start'>
			<SMHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>
						Thời khóa biểu
					</h3>
				</div>
			</SMHeader>
			<div className='w-full h-fit flex justify-center items-start'>
				{/* Add more element here */}
				<div className='w-fit h-[90vh] pt-[5vh] pb-[5vh] px-2 overflow-y-scroll no-scrollbar flex justify-center items-start'>
					<DepartmentTable
						departmentData={departmentTableData}
						page={page}
						updateTable={updateDepartment}
						setPage={setPage}
						rowsPerPage={rowsPerPage}
						setRowsPerPage={setRowsPerPage}
						totalRows={totalRows}
						isDepartmentDetailsOpen={isDepartmentDetailsOpen}
						setDepartmentDetailsOpen={setIsDepartmentDetailsOpen}
						selectedDepartmentId={selectedDepartmentId}
						setSelectedDepartmentId={setSelectedDepartmentId}
					/>
				</div>
				<DepartmentDetails
					open={isDepartmentDetailsOpen}
					setOpen={setIsDepartmentDetailsOpen}
					departmentData={
						departmentData?.result.items.find(
							(item: IDepartmentResponse) => item.id === selectedDepartmentId
						) ?? ({} as IDepartmentResponse)
					}
				/>
			</div>
		</div>
	);
}

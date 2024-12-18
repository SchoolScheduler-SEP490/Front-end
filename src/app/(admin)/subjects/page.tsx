'use client';

import AdminHeader from '@/commons/admin/header';
import { useAppContext } from '@/context/app_provider';
import * as React from 'react';
import SubjectTableSkeleton from './_components/skeleton_table';
import SubjectDetails from './_components/subject_details';
import SubjectTable from './_components/subject_table';
import useFetchData from './_hooks/useFetchData';
import { ISubject, ISubjectTableData } from './_libs/constants';
import { IAdminState } from '@/context/slice_admin';
import { useAdminSelector } from '@/hooks/useReduxStore';

export default function SMSubject() {
	const { sessionToken, selectedSchoolYearId } = useAppContext();
	const { isMenuOpen }: IAdminState = useAdminSelector((state) => state.admin);

	const [page, setPage] = React.useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
	const [totalRows, setTotalRows] = React.useState<number | undefined>(undefined);
	const [subjectTableData, setSubjectTableData] = React.useState<ISubjectTableData[]>([]);
	const [isDetailsShown, setIsDetailsShown] = React.useState<boolean>(false);
	const [selectedSubjectId, setSelectedSubjectId] = React.useState<number>(0);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState<boolean>(false);
	
	const handleUpdateCurriculum = () => {
		setIsUpdateModalOpen(true);
	};
	
	const { data, isValidating, mutate } = useFetchData({
		sessionToken: sessionToken,
		pageIndex: page,
		pageSize: rowsPerPage,
		schoolYearId: selectedSchoolYearId,
	});

	const getMaxPage = () => {
		if (totalRows === 0) return 1;
		return totalRows ? Math.ceil(totalRows / rowsPerPage) : 1;
	};

	React.useEffect(() => {
		mutate();
		// setIsErrorShown(false);
		if (data?.status === 200) {
			setTotalRows(data.result['total-item-count']);
			let index = page * rowsPerPage + 1;
			const tableData: ISubjectTableData[] = data.result.items.map((record: ISubject) => ({
				id: index++,
				subjectName: record['subject-name'],
				subjectCode: record.abbreviation,
				subjectGroup: record['subject-group-type'],
				subjectType: record['is-required'] ? 'Bắt buộc' : 'Tự chọn',
				subjectKey: record.id,
			}));
			setSubjectTableData(tableData);
		}
	}, [data]);

	React.useEffect(() => {
		setPage((prev: number) => Math.min(prev, getMaxPage() - 1));
		if (page <= getMaxPage()) {
			mutate({
				pageSize: rowsPerPage,
				pageIndex: page,
			});
		}
	}, [page, rowsPerPage]);

	// if (error && !isErrorShown) {
	// 	useNotify({
	// 		type: 'error',
	// 		message: TRANSLATOR[error.message] ?? 'Có lỗi xảy ra',
	// 	});
	// 	setIsErrorShown(true);
	// }

	if (isValidating) {
		return (
			<div
				className={`w-[${
					!isMenuOpen ? '84' : '100'
				}%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar`}
			>
				<AdminHeader>
					<div>
						<h3 className='text-title-small text-white font-semibold tracking-wider'>Môn học</h3>
					</div>
				</AdminHeader>
				<SubjectTableSkeleton />
			</div>
		);
	}

	return (
		<div
			className={`w-[${
				!isMenuOpen ? '84' : '100'
			}%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar`}
		>
			<AdminHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>Môn học</h3>
				</div>
			</AdminHeader>
			<div
				className={`w-full h-full flex justify-${
					isDetailsShown ? 'between' : 'center'
				} items-start`}
			>
				<div className='w-[80%] h-[90%] overflow-y-scroll no-scrollbar flex justify-center items-start'>
					<SubjectTable
						subjectTableData={subjectTableData ?? []}
						page={page}
						setPage={setPage}
						rowsPerPage={rowsPerPage}
						setRowsPerPage={setRowsPerPage}
						totalRows={totalRows}
						mutate={mutate}
						selectedSubjectId={selectedSubjectId}
						setSelectedSubjectId={setSelectedSubjectId}
						isDetailsShown={isDetailsShown}
						setIsDetailsShown={setIsDetailsShown}
						isUpdateModalOpen={isUpdateModalOpen}
						setIsUpdateModalOpen={setIsUpdateModalOpen}
					/>
				</div>
				<SubjectDetails
					open={isDetailsShown}
					setOpen={setIsDetailsShown}
					subjectId={selectedSubjectId}
					handleUpdateCurriculum={handleUpdateCurriculum}
				/>
			</div>
		</div>
	);
}

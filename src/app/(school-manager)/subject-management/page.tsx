'use client';

import LoadingComponent from '@/commons/loading';
import SMHeader from '@/commons/school_manager/header';
import { useAppContext } from '@/context/app_provider';
import useNotify from '@/hooks/useNotify';
import * as React from 'react';
import { ISubject, ISubjectTableData } from './_libs/constants';
import SubjectTable from './_components/subject_table';
import useFetchData from './_hooks/useFetchData';
import SubjectTableSkeleton from './_components/table_skeleton';

export default function SMSubject() {
	const [page, setPage] = React.useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
	const { schoolId, sessionToken } = useAppContext();
	const { data, error, isLoading, isValidating, mutate } = useFetchData({
		sessionToken: sessionToken,
		schoolId: schoolId,
		pageSize: rowsPerPage,
		pageIndex: page + 1,
	});
	const [totalRows, setTotalRows] = React.useState<number | undefined>(undefined);
	const [subjectTableData, setSubjectTableData] = React.useState<ISubjectTableData[]>(
		[]
	);

	const getMaxPage = () => {
		if (totalRows === 0) return 1;
		return totalRows ? Math.ceil(totalRows / rowsPerPage) : 1;
	};

	React.useEffect(() => {
		mutate();
		if (data?.status === 200) {
			setTotalRows(data.result['total-item-count']);
			let index = page * rowsPerPage + 1;
			const tableData: ISubjectTableData[] = data.result.items.map(
				(record: ISubject) => ({
					id: index++,
					subjectName: record['subject-name'],
					subjectCode: record.abbreviation,
					subjectGroup: record['subject-group-type'],
					subjectType: record['is-required'] ? 'Bắt buộc' : 'Tự chọn',
					subjectKey: record.id,
				})
			);
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

	if (isValidating) {
		return (
			<div className='w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar'>
				<LoadingComponent loadingStatus={isLoading} />
				<SMHeader>
					<div>
						<h3 className='text-title-small text-white font-semibold tracking-wider'>
							Môn học
						</h3>
					</div>
				</SMHeader>
				<SubjectTableSkeleton />
			</div>
		);
	}

	if (error) {
		useNotify({
			type: 'error',
			message: error.message ?? 'Có lỗi xảy ra',
		});
	}

	return (
		<div className='w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar'>
			<SMHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>
						Môn học
					</h3>
				</div>
			</SMHeader>
			<SubjectTable
				subjectTableData={subjectTableData ?? []}
				page={page}
				setPage={setPage}
				rowsPerPage={rowsPerPage}
				setRowsPerPage={setRowsPerPage}
				totalRows={totalRows}
				mutate={mutate}
			/>
		</div>
	);
}

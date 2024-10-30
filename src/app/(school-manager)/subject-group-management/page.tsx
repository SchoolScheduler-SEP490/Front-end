'use client';

import SMHeader from '@/commons/school_manager/header';
import { useAppContext } from '@/context/app_provider';
import useNotify from '@/hooks/useNotify';
import { TRANSLATOR } from '@/utils/dictionary';
import * as React from 'react';
import SubjectGroupFilterable from './_components/subject_group_filterable';
import SubjectGroupTable from './_components/subject_group_table';
import SubjectGroupTableSkeleton from './_components/table_skeleton';
import useFetchSGData from './_hooks/useFetchSGData';
import { ISubjectGroup, ISubjectGroupTableData } from './_libs/constants';
import { CLASSGROUP_TRANSLATOR } from '@/utils/constants';

export default function SMSubject() {
	const [page, setPage] = React.useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
	const { schoolId, sessionToken } = useAppContext();
	const [totalRows, setTotalRows] = React.useState<number | undefined>(undefined);
	const [subjectGroupTableData, setSubjectGroupTableData] = React.useState<
		ISubjectGroupTableData[]
	>([]);
	const [isFilterable, setIsFilterable] = React.useState<boolean>(false);
	const [selectedYearId, setSelectedYearId] = React.useState<number>(1);
	// const [isErrorShown, setIsErrorShown] = React.useState<boolean>(true);

	const { data, error, isLoading, isValidating, mutate } = useFetchSGData({
		sessionToken: sessionToken,
		schoolId: schoolId,
		pageSize: rowsPerPage,
		pageIndex: page + 1,
		schoolYearId: selectedYearId, //Change this
	});

	const getMaxPage = () => {
		if (totalRows === 0) return 1;
		return totalRows ? Math.ceil(totalRows / rowsPerPage) : 1;
	};

	React.useEffect(() => {
		mutate({ schoolYearId: selectedYearId });
	}, [selectedYearId]);

	React.useEffect(() => {
		mutate();
		if (data?.status === 200) {
			setTotalRows(data.result['total-item-count']);
			let index = page * rowsPerPage + 1;
			const tableData: ISubjectGroupTableData[] = data.result.items.map(
				(record: ISubjectGroup) =>
					({
						id: index++,
						subjectGroupName: record['group-name'],
						subjectGroupCode: record['group-code'],
						subjectGroupKey: record.id,
						grade: CLASSGROUP_TRANSLATOR[record.grade],
					} as ISubjectGroupTableData)
			);
			setSubjectGroupTableData(tableData);
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
				<SMHeader>
					<div>
						<h3 className='text-title-small text-white font-semibold tracking-wider'>
							Môn học
						</h3>
					</div>
				</SMHeader>
				<SubjectGroupTableSkeleton />
			</div>
		);
	}

	// if (error && !isErrorShown) {
	// 	useNotify({
	// 		type: 'error',
	// 		message: TRANSLATOR[error.message] ?? 'Có lỗi xảy ra',
	// 	});
	// 	setIsErrorShown(true);
	// }

	return (
		<div className='w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar'>
			<SMHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>
						Môn học
					</h3>
				</div>
			</SMHeader>
			<div
				className={`w-full h-auto flex flex-row ${
					isFilterable
						? 'justify-start items-start'
						: 'justify-center items-center'
				} pt-5 px-[1.5vw] gap-[1vw]`}
			>
				<SubjectGroupTable
					isFilterable={isFilterable}
					setIsFilterable={setIsFilterable}
					subjectGroupTableData={subjectGroupTableData ?? []}
					page={page}
					setPage={setPage}
					rowsPerPage={rowsPerPage}
					setRowsPerPage={setRowsPerPage}
					totalRows={totalRows}
					mutate={mutate}
				/>
				<SubjectGroupFilterable
					open={isFilterable}
					setOpen={setIsFilterable}
					selectedYearId={selectedYearId}
					setSelectedYearId={setSelectedYearId}
				/>
			</div>
		</div>
	);
}

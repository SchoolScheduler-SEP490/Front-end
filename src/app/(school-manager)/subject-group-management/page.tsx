'use client';

import SMHeader from '@/commons/school_manager/header';
import { useAppContext } from '@/context/app_provider';
import useNotify from '@/hooks/useNotify';
import { CLASSGROUP_TRANSLATOR } from '@/utils/constants';
import { TRANSLATOR } from '@/utils/dictionary';
import * as React from 'react';
import SubjectGroupDetails from './_components/subject_group_details';
import SubjectGroupTable from './_components/subject_group_table';
import SubjectGroupTableSkeleton from './_components/table_skeleton';
import useFetchSGData from './_hooks/useFetchSGData';
import { ISubjectGroup, ISubjectGroupTableData } from './_libs/constants';

export default function SMSubject() {
	const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
	const [page, setPage] = React.useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
	const [totalRows, setTotalRows] = React.useState<number | undefined>(undefined);
	const [subjectGroupTableData, setSubjectGroupTableData] = React.useState<
		ISubjectGroupTableData[]
	>([]);
	const [isFilterable, setIsFilterable] = React.useState<boolean>(false);
	const [selectedSubjectGroupId, setSelectedSubjectGroupId] = React.useState<number>(0);
	const [isDetailOpen, setIsDetailOpen] = React.useState<boolean>(false);
	const [isErrorShown, setIsErrorShown] = React.useState<boolean>(false);

	const { data, error, isLoading, isValidating, mutate } = useFetchSGData({
		sessionToken: sessionToken,
		schoolId: schoolId,
		pageSize: rowsPerPage,
		pageIndex: page + 1,
		schoolYearId: selectedSchoolYearId, //Change this
	});

	const getMaxPage = () => {
		if (totalRows === 0) return 1;
		return totalRows ? Math.ceil(totalRows / rowsPerPage) : 1;
	};

	React.useEffect(() => {
		mutate({ schoolYearId: selectedSchoolYearId, grade: undefined });
	}, [selectedSchoolYearId]);

	React.useEffect(() => {
		mutate();
		setIsErrorShown(false);
		setSubjectGroupTableData([]);
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

	React.useEffect(() => {
		if (error && !isErrorShown) {
			setIsErrorShown(true);
			useNotify({
				message: TRANSLATOR[error?.message] ?? 'Dữ liệu tổ hợp chưa được tạo',
				type: 'error',
			});
		}
	}, [error]);

	React.useEffect(() => {
		mutate({ schoolYearId: selectedSchoolYearId });
		setIsErrorShown(false);
	}, [selectedSchoolYearId]);

	if (isValidating) {
		return (
			<div className='w-[84%] h-screen flex flex-col justify-start items-start'>
				<SMHeader>
					<div>
						<h3 className='text-title-small text-white font-semibold tracking-wider'>
							Tổ hợp môn
						</h3>
					</div>
				</SMHeader>
				<div className='w-[100%] h-[85%] overflow-y-scroll no-scrollbar flex justify-center items-start'>
					<SubjectGroupTableSkeleton />
				</div>
			</div>
		);
	}

	return (
		<div className='w-[84%] h-screen flex flex-col justify-start items-start'>
			<SMHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>
						Tổ hợp môn
					</h3>
				</div>
			</SMHeader>
			<div
				className={`w-full h-full flex flex-row ${
					false ? 'justify-start items-start' : 'justify-center items-center'
				} pl-[1.5vw] gap-[1vw]`}
			>
				<div className='w-[70%] h-[90%] overflow-y-scroll no-scrollbar flex justify-center items-start'>
					<SubjectGroupTable
						isFilterable={false}
						setIsFilterable={setIsFilterable}
						subjectGroupTableData={subjectGroupTableData ?? []}
						page={page}
						setPage={setPage}
						rowsPerPage={rowsPerPage}
						setRowsPerPage={setRowsPerPage}
						totalRows={totalRows}
						mutate={mutate}
						selectedSubjectGroupId={selectedSubjectGroupId}
						setSelectedSubjectGroupId={setSelectedSubjectGroupId}
						isOpenViewDetails={isDetailOpen}
						setOpenViewDetails={setIsDetailOpen}
					/>
				</div>
				<SubjectGroupDetails
					open={isDetailOpen}
					setOpen={setIsDetailOpen}
					subjectGroupId={selectedSubjectGroupId}
				/>
			</div>
		</div>
	);
}

'use client';

import SMHeader from '@/commons/school_manager/header';
import { useAppContext } from '@/context/app_provider';
import * as React from 'react';
import SubjectTable from './_components/subject_table';
import SubjectTableSkeleton from './_components/skeleton_table';
import useFetchData from './_hooks/useFetchData';
import { ISubjectResponse, ISubjectTableData } from './_libs/constants';
import SubjectDetails from './_components/subject_details';
import useNotify from '@/hooks/useNotify';
import { TRANSLATOR } from '@/utils/dictionary';

export default function SMSubject() {
	const { selectedSchoolYearId, sessionToken } = useAppContext();

	const [page, setPage] = React.useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
	const [totalRows, setTotalRows] = React.useState<number | undefined>(undefined);
	const [subjectTableData, setSubjectTableData] = React.useState<ISubjectTableData[]>([]);
	const [isDetailsShown, setIsDetailsShown] = React.useState<boolean>(false);
	const [selectedSubjectId, setSelectedSubjectId] = React.useState<number>(0);
	const [isErrorShown, setIsErrorShown] = React.useState<boolean>(true);

	const { data, isValidating, error, mutate } = useFetchData({
		sessionToken: sessionToken,
		schoolYearId: selectedSchoolYearId,
		pageSize: rowsPerPage,
		pageIndex: page + 1,
	});

	const getMaxPage = () => {
		if (totalRows === 0) return 1;
		return totalRows ? Math.ceil(totalRows / rowsPerPage) : 1;
	};

	React.useEffect(() => {
		setSubjectTableData([]);
		mutate();
		setIsErrorShown(false);
		if (data?.status === 200) {
			setTotalRows(data.result['total-item-count']);
			let index = page * rowsPerPage + 1;
			const tableData: ISubjectTableData[] = data.result.items.map(
				(record: ISubjectResponse) => ({
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
	}, [data, selectedSchoolYearId]);

	React.useEffect(() => {
		if (error && !isErrorShown) {
			useNotify({
				message: TRANSLATOR[error?.message] ?? error?.message ?? 'Có lỗi xảy ra',
				type: 'error',
			});
			setIsErrorShown(true);
		}
	}, [isValidating]);

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
		mutate({ schoolYearId: selectedSchoolYearId });
	}, [selectedSchoolYearId]);

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
				<SubjectTableSkeleton />
			</div>
		);
	}

	return (
		<div className='w-[84%] h-screen flex flex-col justify-start items-start overflow-y-hidden overflow-x-hidden'>
			<SMHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>
						Môn học
					</h3>
				</div>
			</SMHeader>
			<div
				className={`w-full h-full flex justify-${
					isDetailsShown ? 'end' : 'center'
				} items-start`}
			>
				<div className='w-[70%] h-[90%] overflow-y-scroll no-scrollbar flex justify-center items-start'>
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
					/>
				</div>
				<SubjectDetails
					open={isDetailsShown}
					setOpen={setIsDetailsShown}
					subjectId={selectedSubjectId}
				/>
			</div>
		</div>
	);
}

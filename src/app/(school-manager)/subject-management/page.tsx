'use client';

import LoadingComponent from '@/commons/loading';
import SMHeader from '@/commons/school_manager/header';
import { useAppContext } from '@/context/app_provider';
import useNotify from '@/hooks/useNotify';
import * as React from 'react';
import { ISubject, ISubjectTableData } from '../_utils/contants';
import SubjectTable from './_components/subject_table';
import useFetchData from './_hooks/useFetchData';

function importRecord(props: ISubjectTableData): ISubjectTableData {
	const { id, subjectName, subjectCode, subjectGroup, subjectType } = props;
	return {
		id,
		subjectName,
		subjectCode,
		subjectGroup,
		subjectType,
	};
}

export default function SMSubject() {
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const { schoolId, sessionToken } = useAppContext();
	const { data, error, isValidating, mutate } = useFetchData({
		sessionToken: sessionToken,
		schoolId: schoolId,
		pageSize: rowsPerPage,
		pageIndex: page + 1,
	});
	const [totalRows, setTotalRows] = React.useState<number | undefined>(undefined);
	const [subjectTableData, setSubjectTableData] = React.useState<ISubjectTableData[]>(
		[]
	);

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
					subjectGroup: record.description,
					subjectType: record.id % 2 === 0 ? 'Bắt buộc' : 'Tự chọn',
				})
			);
			setSubjectTableData([...subjectTableData, ...tableData]);
		}
	}, [data?.result?.items, page, rowsPerPage]);

	if (isValidating) {
		return <LoadingComponent loadingStatus={isValidating} />;
	}

	if (error) {
		useNotify({
			type: 'error',
			message: error.message ?? 'Có lỗi xảy ra',
		});
	}

	return (
		<div className='w-[84%] h-screen flex flex-col justify-start items-start'>
			<SMHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>
						Môn học
					</h3>
				</div>
			</SMHeader>
			<SubjectTable
				subjectTableData={subjectTableData ?? []}
				serverPage={page}
				setServerPage={setPage}
				rowsPerPage={rowsPerPage}
				setRowsPerPage={setRowsPerPage}
				totalRows={totalRows}
			/>
		</div>
	);
}

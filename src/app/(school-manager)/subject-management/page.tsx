'use client';

import SMHeader from '@/commons/school_manager/header';
import { useAppContext } from '@/context/app_provider';
import SubjectTable from './_components/subject_table';
import SubjectTableSkeleton from './_components/skeleton_table';
import useFetchData from './_hooks/useFetchData';
import { ISubjectResponse, ISubjectTableData } from './_libs/constants';
import SubjectDetails from './_components/subject_details';
import useNotify from '@/hooks/useNotify';
import { TRANSLATOR } from '@/utils/dictionary';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function SMSubject() {
	const { selectedSchoolYearId, sessionToken } = useAppContext();
	const isMenuOpen: boolean = useSelector((state: any) => state.schoolManager.isMenuOpen);

	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(5);
	const [totalRows, setTotalRows] = useState<number | undefined>(undefined);
	const [subjectTableData, setSubjectTableData] = useState<ISubjectTableData[]>([]);
	const [isDetailsShown, setIsDetailsShown] = useState<boolean>(false);
	const [selectedSubjectId, setSelectedSubjectId] = useState<number>(0);
	const [isErrorShown, setIsErrorShown] = useState<boolean>(true);

	const {
		data: subjectData,
		isValidating: isSubjectValidating,
		error: subjectError,
		mutate: updateSubject,
	} = useFetchData({
		sessionToken: sessionToken,
		schoolYearId: selectedSchoolYearId,
		pageSize: rowsPerPage,
		pageIndex: page + 1,
	});

	const getMaxPage = () => {
		if (totalRows === 0) return 1;
		return totalRows ? Math.ceil(totalRows / rowsPerPage) : 1;
	};

	useEffect(() => {
		setSubjectTableData([]);
		updateSubject();
		setIsErrorShown(false);
		if (subjectData?.status === 200) {
			setTotalRows(subjectData.result['total-item-count']);
			let index = page * rowsPerPage + 1;
			const tableData: ISubjectTableData[] = subjectData.result.items.map(
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
	}, [subjectData, selectedSchoolYearId]);

	useEffect(() => {
		if (subjectError && !isErrorShown) {
			useNotify({
				message:
					TRANSLATOR[subjectError?.message] ?? subjectError?.message ?? 'Có lỗi xảy ra',
				type: 'error',
			});
			setIsErrorShown(true);
		}
	}, [isSubjectValidating]);

	useEffect(() => {
		setPage((prev: number) => Math.min(prev, getMaxPage() - 1));
		if (page <= getMaxPage()) {
			updateSubject({
				pageSize: rowsPerPage,
				pageIndex: page,
			});
		}
	}, [page, rowsPerPage]);

	useEffect(() => {
		updateSubject({ schoolYearId: selectedSchoolYearId });
	}, [selectedSchoolYearId]);

	if (isSubjectValidating) {
		return (
			<div
				className={`w-[${
					!isMenuOpen ? '84' : '100'
				}%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar`}
			>
				<SMHeader>
					<div>
						<h3 className='text-title-small text-white font-semibold tracking-wider'>
							Môn học
						</h3>
					</div>
				</SMHeader>
				<div
					className={`w-full h-full flex justify-${false ? 'end' : 'center'} items-start`}
				>
					<div className='w-[70%] h-[90%] overflow-y-scroll no-scrollbar flex justify-center items-start'>
						<SubjectTableSkeleton />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`w-[${
				!isMenuOpen ? '84' : '100'
			}%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar`}
		>
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
						mutate={updateSubject}
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

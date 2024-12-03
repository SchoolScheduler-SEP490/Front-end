'use client';

import SMHeader from '@/commons/school_manager/header';
import { useAppContext } from '@/context/app_provider';
import useNotify from '@/hooks/useNotify';
import { CLASSGROUP_TRANSLATOR } from '@/utils/constants';
import { TRANSLATOR } from '@/utils/dictionary';
import * as React from 'react';
import { useSelector } from 'react-redux';
import CurriculumTable from './_components/curiculumn_table';
import CurriculumTableSkeleton from './_components/skeleton_table';
import useFetchCurriculumData from './_hooks/useFetchCurriculum';
import { ICurriculumResponse, ICurriculumTableData } from './_libs/constants';

export default function SMSubject() {
	const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
	const isMenuOpen: boolean = useSelector((state: any) => state.schoolManager.isMenuOpen);

	const [page, setPage] = React.useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
	const [totalRows, setTotalRows] = React.useState<number | undefined>(undefined);
	const [curriculumTableData, setCurriculumTableData] = React.useState<ICurriculumTableData[]>([]);
	const [selectedCurriculumId, setSelectedCurriculumId] = React.useState<number>(0);
	const [isErrorShown, setIsErrorShown] = React.useState<boolean>(false);

	const { data, error, isValidating, mutate } = useFetchCurriculumData({
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
		setCurriculumTableData([]);
		if (data?.status === 200 && data?.result) {
			setTotalRows(data.result['total-item-count']);
			let index = page * rowsPerPage + 1;
			const tableData: ICurriculumTableData[] = data.result.items.map(
				(record: ICurriculumResponse) =>
					({
						id: index++,
						curriculumName: record['curriculum-name'],
						curriculumCode: record['curriculum-code'],
						curriculumKey: record.id,
						grade: CLASSGROUP_TRANSLATOR[record.grade],
					} as ICurriculumTableData)
			);
			setCurriculumTableData(tableData);
		} else if (data?.status === 200 && !data?.result) {
			useNotify({
				message: 'Chưa có khung chương trình',
				type: 'error',
			});
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
				message: TRANSLATOR[error?.message] ?? 'Dữ liệu Khung chương trình chưa được tạo',
				type: 'error',
			});
		}
	}, [isValidating]);

	React.useEffect(() => {
		mutate({ schoolYearId: selectedSchoolYearId });
		setIsErrorShown(false);
	}, [selectedSchoolYearId]);

	if (isValidating) {
		return (
			<div
				className={`w-[${
					!isMenuOpen ? '84' : '100'
				}%] h-screen flex flex-col justify-start items-start`}
			>
				<SMHeader>
					<div>
						<h3 className='text-title-small text-white font-semibold tracking-wider'>
							Khung chương trình
						</h3>
					</div>
				</SMHeader>
				<div
					className={`w-full h-full flex flex-row ${
						false ? 'justify-start items-start' : 'justify-center items-center'
					} pl-[1.5vw] gap-[1vw]`}
				>
					<div className='w-[80%] h-[90%] overflow-y-scroll no-scrollbar flex justify-center items-start'>
						<CurriculumTableSkeleton />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`w-[${
				!isMenuOpen ? '84' : '100'
			}%] h-screen flex flex-col justify-start items-start`}
		>
			<SMHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>
						Khung chương trình
					</h3>
				</div>
			</SMHeader>
			<div
				className={`w-full h-full flex flex-row ${
					false ? 'justify-start items-start' : 'justify-center items-center'
				} pl-[1.5vw] gap-[1vw]`}
			>
				<div className='w-[80%] h-[90%] overflow-y-scroll no-scrollbar flex justify-center items-start'>
					<CurriculumTable
						curriculumTableData={curriculumTableData ?? []}
						page={page}
						setPage={setPage}
						rowsPerPage={rowsPerPage}
						setRowsPerPage={setRowsPerPage}
						totalRows={totalRows}
						mutate={mutate}
						selectedCurriculumId={selectedCurriculumId}
						setSelectedCurriculumId={setSelectedCurriculumId}
					/>
				</div>
			</div>
		</div>
	);
}

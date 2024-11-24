'use client';
import { useAppContext } from '@/context/app_provider';
import {
	Checkbox,
	Paper,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import { useEffect, useState } from 'react';
import useFetchClasses from '../_hooks/useFetchClasses';
import { IClassResponse } from '../_libs/constant';

const StudentClassInformationTable = () => {
	const { schoolId, selectedSchoolYearId, sessionToken } = useAppContext();

	const [classTableData, setClassTableData] = useState<IClassResponse[]>([]);

	const {
		data: classData,
		mutate: updateClass,
		isValidating: isClassValidating,
	} = useFetchClasses({
		pageIndex: 1,
		pageSize: 1000,
		schoolId: Number(schoolId),
		schoolYearId: selectedSchoolYearId,
		sessionToken,
	});

	useEffect(() => {
		setClassTableData([]);
		updateClass();
		if (classData?.status === 200) {
			const tmpClassData: IClassResponse[] = classData.result.items;
			if (tmpClassData.length > 0) {
				setClassTableData(tmpClassData);
			}
		}
	}, [classData]);

	return (
		<div className='w-full h-[90vh] flex flex-col justify-start items-center px-[2vw] pt-[5vh] pb-[5vh] overflow-y-scroll no-scrollbar'>
			<Paper sx={{ mb: 2, userSelect: 'none' }}>
				<TableContainer>
					<Table aria-label='class table' size='small'>
						<TableHead>
							<TableRow>
								<TableCell sx={{ fontWeight: 'bold' }}>STT</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Lớp học</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>GVCN</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Buổi học</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Cả ngày</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Nhóm lớp</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>KCT</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Phòng</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Số tiết</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{isClassValidating && classTableData.length === 0 && (
								<>
									{[1, 2, 3, 4, 5].map((index) => (
										<TableRow key={index}>
											<TableCell>{index + 1}</TableCell>
											<TableCell>
												<Skeleton variant='text' animation='wave' />
											</TableCell>
											<TableCell>
												<Skeleton variant='text' animation='wave' />
											</TableCell>
											<TableCell>
												<Skeleton variant='text' animation='wave' />
											</TableCell>
											<TableCell>
												<Checkbox disabled checked={false} />
											</TableCell>
											<TableCell>
												<Skeleton variant='text' animation='wave' />
											</TableCell>
											<TableCell>
												<Skeleton variant='text' animation='wave' />
											</TableCell>
											<TableCell>
												<Skeleton variant='text' animation='wave' />
											</TableCell>
											<TableCell>
												<Skeleton variant='text' animation='wave' />
											</TableCell>
											<TableCell width={80}>
												<p className='text-primary-400 underline'>
													Chi tiết
												</p>
											</TableCell>
										</TableRow>
									))}
								</>
							)}
							{classTableData.map((row, index) => (
								<TableRow key={index}>
									<TableCell>{index + 1}</TableCell>
									<TableCell>{row.name}</TableCell>
									<TableCell>{row['homeroom-teacher-abbreviation']}</TableCell>
									<TableCell>{row['main-session-text']}</TableCell>
									<TableCell>
										<Checkbox disabled checked={row['is-full-day']} />
									</TableCell>
									<TableCell>
										{row['student-class-group-code'] ?? '- - -'}
									</TableCell>
									<TableCell>{row['curriculum-code'] ?? '- - -'}</TableCell>
									<TableCell>{row['room-name'] ?? '- - -'}</TableCell>
									<TableCell>{row['period-count']}</TableCell>
									<TableCell width={80}>
										<a
											href={`/class-management/detail?id=${row.id}`}
											target='_blank'
											rel='noopener noreferrer'
											className='text-primary-400 underline'
										>
											Chi tiết
										</a>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</div>
	);
};

export default StudentClassInformationTable;

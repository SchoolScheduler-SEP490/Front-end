'use client';
import { useAppContext } from '@/context/app_provider';
import {
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
import useFetchTeachers from '../../../_hooks/useFetchTeachers';
import { ITeachableSubject, ITeacherResponse } from '../../../_libs/constants';

const getTeacherFullName = (teacher: ITeacherResponse): string => {
	return `${teacher['first-name']} ${teacher['last-name']} (${teacher.abbreviation})`;
};

const getShortenedTeachableSubjects = (subject: ITeachableSubject[]): string => {
	var resStr: string[] = [];
	subject.forEach((subject) => {
		if (subject['subject-name'].length > 5) {
			resStr.push(subject.abbreviation);
		} else {
			resStr.push(subject['subject-name']);
		}
	});

	return resStr.join(' - ');
};

const DetailsTeacherTable = () => {
	const { schoolId, sessionToken } = useAppContext();
	const [teacherData, setTeacherData] = useState<ITeacherResponse[]>([]);

	const {
		data: teacherResponse,
		mutate: updateTeacher,
		isValidating: isTeacherValidating,
	} = useFetchTeachers({
		schoolId,
		pageIndex: 1,
		pageSize: 100,
		sessionToken,
		includeDeleted: false,
	});

	useEffect(() => {
		setTeacherData([]);
		updateTeacher();
		if (teacherResponse?.status === 200) {
			const tmpTeacherData: ITeacherResponse[] = teacherResponse.result.items ?? [];
			if (tmpTeacherData.length > 0) {
				setTeacherData(tmpTeacherData);
			}
		}
	}, [teacherResponse]);

	return (
		<div className='w-full h-[85vh] flex flex-col justify-start items-center px-[2vw] pt-[5vh] pb-[5vh] overflow-y-scroll no-scrollbar'>
			<Paper sx={{ mb: 2 }}>
				<TableContainer component={Paper}>
					<Table aria-label='teacher table' size='small'>
						<TableHead>
							<TableRow>
								<TableCell sx={{ fontWeight: 'bold' }}>STT</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Họ và tên</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>TBM</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Môn dạy</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Chủ nhiệm</TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{isTeacherValidating && teacherData.length === 0 && (
								<>
									{[1, 2, 3, 4, 5].map((index) => (
										<TableRow key={index}>
											<TableCell width={50} sx={{ textAlign: 'center' }}>
												<Skeleton variant='text' animation='wave' />
											</TableCell>
											<TableCell>
												<Skeleton
													variant='text'
													animation='wave'
													width={150}
												/>
											</TableCell>
											<TableCell
												sx={{
													overflow: 'hidden',
													textOverflow: 'ellipsis',
													whiteSpace: 'nowrap',
												}}
											>
												<Skeleton
													variant='text'
													animation='wave'
													width={150}
												/>
											</TableCell>
											<TableCell>
												<Skeleton
													variant='text'
													animation='wave'
													width={100}
												/>
											</TableCell>
											<TableCell>
												<Skeleton
													variant='text'
													animation='wave'
													width={150}
												/>
											</TableCell>
											<TableCell width={110}>
												<Skeleton
													variant='text'
													animation='wave'
													width={150}
												/>
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
							{teacherData.map((row, index) => (
								<TableRow key={index}>
									<TableCell width={50} sx={{ textAlign: 'center' }}>
										{index + 1}
									</TableCell>
									<TableCell>{getTeacherFullName(row)}</TableCell>
									<TableCell
										sx={{
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap',
										}}
									>
										{row.email}
									</TableCell>
									<TableCell>{row['department-name']}</TableCell>
									<TableCell>
										{getShortenedTeachableSubjects(row['teachable-subjects'])}
									</TableCell>
									<TableCell width={110}>
										{row['home-room-teacher-of-class'] ?? '- - -'}
									</TableCell>
									<TableCell width={80}>
										<a
											href={`/teacher-management/detail?id=${row.id}`}
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

export default DetailsTeacherTable;

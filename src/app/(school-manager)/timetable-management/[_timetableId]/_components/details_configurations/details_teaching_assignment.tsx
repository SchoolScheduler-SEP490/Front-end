'use client';
import { ITimetableGenerationState } from '@/context/slice_timetable_generation';
import { useSMSelector } from '@/hooks/useReduxStore';
import { ITeacherAssignmentSummary, ITeacherPeriodsPerWeek } from '@/utils/constants';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import {
	Collapse,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import React, { useState } from 'react';

const DetailsTeachingAssignment = () => {
	const { dataStored }: ITimetableGenerationState = useSMSelector(
		(state) => state.timetableGeneration
	);
	const [openRows, setOpenRows] = useState<{ [key: number]: boolean }>({});

	// Toggle trạng thái mở rộng/collapse
	const toggleRow = (teacherId: number) => {
		setOpenRows((prev) => ({ ...prev, [teacherId]: !prev[teacherId] }));
	};

	// Tính tổng số tiết của giáo viên
	const calculateTotalPeriods = (subjects: ITeacherPeriodsPerWeek[]) => {
		return subjects.reduce((sum, subject) => sum + subject['period-count'], 0);
	};

	return (
		<div className='w-full h-full max-h-[90vh] flex justify-center items-start px-[10vw] py-[5vh] overflow-y-scroll no-scrollbar'>
			<TableContainer component={Paper}>
				<Table size='small'>
					{/* Header */}
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeight: 'bold' }}>STT</TableCell>
							<TableCell width={50} />
							<TableCell sx={{ fontWeight: 'bold' }}>Tên Giáo Viên</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Viết Tắt</TableCell>
							<TableCell align='center' sx={{ fontWeight: 'bold' }}>
								Tổng số tiết/tuần
							</TableCell>
						</TableRow>
					</TableHead>

					{/* Body */}
					<TableBody>
						{dataStored &&
							dataStored['teacher-assignments-summary'].map(
								(teacher: ITeacherAssignmentSummary, index: number) => (
									<React.Fragment key={index}>
										{/* Hàng chính (giáo viên) */}
										<TableRow
											sx={{ bgcolor: '#f5f5f5', cursor: 'pointer' }}
											onClick={() => toggleRow(teacher['teacher-id'])}
										>
											<TableCell width={50} align='center'>
												{index + 1}
											</TableCell>
											<TableCell width={50}>
												<IconButton size='small' onClick={() => toggleRow(teacher['teacher-id'])}>
													{openRows[teacher['teacher-id']] ? (
														<KeyboardArrowUp />
													) : (
														<KeyboardArrowDown />
													)}
												</IconButton>
											</TableCell>
											<TableCell width={300}>{teacher['teacher-name']}</TableCell>
											<TableCell width={200}>{teacher['teacher-abbreviation']}</TableCell>
											<TableCell align='center'>
												{calculateTotalPeriods(teacher['total-periods-per-week'])}
											</TableCell>
										</TableRow>

										{/* Hàng mở rộng (danh sách môn học) */}
										<TableRow>
											<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
												<Collapse in={openRows[teacher['teacher-id']]} timeout='auto' unmountOnExit>
													<Table size='small'>
														<TableHead>
															<TableRow>
																<TableCell sx={{ fontWeight: 'bold' }}></TableCell>
																<TableCell width={50} />
																<TableCell sx={{ fontWeight: 'bold' }}>Môn Học</TableCell>
																<TableCell sx={{ fontWeight: 'bold' }}>Viết Tắt</TableCell>
																<TableCell align='center' sx={{ fontWeight: 'bold' }}>
																	Số tiết/tuần
																</TableCell>
															</TableRow>
														</TableHead>
														<TableBody>
															{teacher['total-periods-per-week'].map(
																(subject: ITeacherPeriodsPerWeek) => (
																	<TableRow key={subject['subject-id']}>
																		<TableCell width={60} align='center'></TableCell>
																		<TableCell width={50} />
																		<TableCell width={300}>{subject['subject-name']}</TableCell>
																		<TableCell width={200}>
																			{subject['subject-abbreviation']}
																		</TableCell>
																		<TableCell align='center'>{subject['period-count']}</TableCell>
																	</TableRow>
																)
															)}
															<TableRow></TableRow>
														</TableBody>
													</Table>
												</Collapse>
											</TableCell>
										</TableRow>
									</React.Fragment>
								)
							)}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default DetailsTeachingAssignment;

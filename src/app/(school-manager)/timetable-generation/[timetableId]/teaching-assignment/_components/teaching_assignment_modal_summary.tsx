'use client';
import ContainedButton from '@/commons/button-contained';
import { ITimetableGenerationState } from '@/context/slice_timetable_generation';
import { useSMSelector } from '@/hooks/useReduxStore';
import { ITeacherAssignmentSummary, ITeacherPeriodsPerWeek } from '@/utils/constants';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import {
	Box,
	Collapse,
	IconButton,
	Modal,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import React, { useState } from 'react';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '50vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

interface ISummaryModalProps {
	isModalOpen: boolean;
	setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TeachingAssignmentSummaryModal = (props: ISummaryModalProps) => {
	const { isModalOpen, setIsModalOpen } = props;
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

	const handleClose = () => {
		setIsModalOpen(false);
	};

	return (
		<Modal
			disableEnforceFocus
			disableAutoFocus
			disableRestoreFocus
			open={isModalOpen}
			onClose={handleClose}
			aria-labelledby='keep-mounted-modal-title'
			aria-describedby='keep-mounted-modal-description'
		>
			<Box sx={style}>
				<div
					id='modal-header'
					className='w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3 py-2'
				>
					<Typography
						variant='h6'
						component='h2'
						className='text-title-medium-strong font-normal opacity-60'
					>
						Kết quả phân công
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='w-full h-[60vh] max-h-[60vh] overflow-y-scroll no-scrollbar flex flex-row justify-start items-start'>
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
									dataStored['teacher-assignments-summary']?.map(
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
														<IconButton
															size='small'
															onClick={() => toggleRow(teacher['teacher-id'])}
														>
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
														<Collapse
															in={openRows[teacher['teacher-id']]}
															timeout='auto'
															unmountOnExit
														>
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
																		(subject: ITeacherPeriodsPerWeek, index: number) => (
																			<TableRow key={subject['subject-id']}>
																				<TableCell width={60} align='center'>
																					
																				</TableCell>
																				<TableCell width={50} />
																				<TableCell width={300}>{subject['subject-name']}</TableCell>
																				<TableCell width={200}>
																					{subject['subject-abbreviation']}
																				</TableCell>
																				<TableCell align='center'>
																					{subject['period-count']}
																				</TableCell>
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
				<div
					id='modal-footer'
					className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'
				>
					<ContainedButton
						title='đóng'
						onClick={handleClose}
						disableRipple
						styles='!bg-basic-gray-active !text-basic-gray !py-1 px-4'
					/>
				</div>
			</Box>
		</Modal>
	);
};

export default TeachingAssignmentSummaryModal;

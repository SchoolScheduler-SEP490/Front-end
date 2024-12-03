'use client';
import ContainedButton from '@/commons/button-contained';
import { ITimetableGenerationState, updateDataStored } from '@/context/slice_timetable_generation';
import useFilterArray from '@/hooks/useFilterArray';
import useNotify from '@/hooks/useNotify';
import {
	IConfigurationStoreObject,
	IFixedPeriodObject,
	IFreePeriodObject,
	INoAssignPeriodObject,
	TIMETABLE_SLOTS,
	WEEK_DAYS,
} from '@/utils/constants';
import { firestore } from '@/utils/firebaseConfig';
import CloseIcon from '@mui/icons-material/Close';
import {
	Box,
	IconButton,
	Modal,
	styled,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	tooltipClasses,
	TooltipProps,
	Typography,
} from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ITeachersLessonsObject } from '../_libs/constants';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.common.white,
		color: 'rgba(0, 0, 0, 0.87)',
		boxShadow: theme.shadows[1],
		fontSize: 15,
	},
}));

const getExistingSlot = (
	data: ITeachersLessonsObject[],
	slotId: number
): ITeachersLessonsObject | undefined => {
	const existingSlot: ITeachersLessonsObject | undefined = data.find((item) =>
		item.slots.includes(slotId)
	);
	return existingSlot;
};

const isValidSlot = (
	mainSession: number,
	slotIndex: number,
	isSubSessionAllow?: boolean,
	onlySubSession?: boolean // thêm tham số này
): boolean => {
	// Nếu chỉ có tiết trái buổi thì disable tiết chính khóa
	if (onlySubSession) {
		return !(1 + mainSession * 5 <= slotIndex && slotIndex <= 5 + mainSession * 5);
	}

	// Kiểm tra tiết chính khóa hoặc bật cờ cho phép tiết trái buổi
	if ((1 + mainSession * 5 <= slotIndex && slotIndex <= 5 + mainSession * 5) || isSubSessionAllow) {
		return true;
	}

	return false;
};

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '50vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

interface IFixedPeriodAssignmentProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	data: ITeachersLessonsObject[];
	selectedObject: ITeachersLessonsObject;
	mainSession: number;
}

const FixedPeriodEditModal = (props: IFixedPeriodAssignmentProps) => {
	const { selectedObject, open, setOpen, data, mainSession } = props;
	const { dataStored, dataFirestoreName }: ITimetableGenerationState = useSelector(
		(state: any) => state.timetableGeneration
	);
	const dispatch = useDispatch();

	const [selectedCells, setSelectedCells] = useState<number[]>([]);

	const handleClose = () => {
		setSelectedCells([]);
		setOpen(false);
	};

	useEffect(() => {
		if (open) {
			if (selectedObject && selectedObject.slots.length > 0) {
				setSelectedCells(selectedObject.slots);
			}
		}
	}, [selectedObject, open]);

	//Check môn học xếp đủ tiết chính khóa/trái buổi
	const isValidSlotInSession = (cellId: number): boolean => {
		if (selectedCells.includes(cellId)) {
			setSelectedCells(selectedCells.filter((id) => id !== cellId));
		} else {
			// Case nằm trong buổi chính khóa
			if (isValidSlot(mainSession, ((cellId - 1) % 10) + 1)) {
				// Lấy ra số tiết đã xếp vào buổi chính khóa
				const tmpSelectedSlotInSession = selectedCells.filter(
					(id) => 1 + mainSession * 5 <= id && id <= 5 + mainSession * 5
				);

				// Check xem số tiết đã xếp vào buổi chính khóa có vượt quá số tiết chính khóa hay chưa
				if (tmpSelectedSlotInSession.length < selectedObject.totalMainSlotsPerWeek) {
					return true;
				} else {
					useNotify({
						message: `Môn học chỉ có ${selectedObject.totalMainSlotsPerWeek} tiết chính khóa`,
						type: 'warning',
					});
				}
			} else if (!isValidSlot(mainSession, ((cellId - 1) % 10) + 1)) {
				// Lấy ra số tiết đã xếp vào tiết trái buổi

				const tmpSelectedSlotInSession = selectedCells.filter(
					(id) => 1 + mainSession * 5 <= id && id <= 5 + mainSession * 5
				);

				// Check xem số tiết đã xếp vào buổi trái buổi có vượt quá số tiết trái buổi hay chưa
				if (tmpSelectedSlotInSession.length < selectedObject.totalSubSlotsPerWeek) {
					return true;
				} else {
					useNotify({
						message: `Môn học chỉ có ${selectedObject.totalSubSlotsPerWeek} tiết trái buổi`,
						type: 'warning',
					});
				}
			}
		}
		return false;
	};

	//Check môn học tiết đôi và môn học không trùng lặp trong một ngày
	const isValidSelectedSlotInDay = (cellId: number): boolean => {
		// Phân tích ID của slot xem nó là ngày nào
		const weekdayId = Math.floor((cellId - 1) / 10);

		//Nếu tiết môn đã chọn không có tiết đôi
		if (!selectedObject.isDoubleSlot) {
			// Nếu tiết đã chọn cùng ngày với tiết đang chọn thì show noti
			if (selectedCells.some((id) => Math.floor((id - 1) / 10) === weekdayId)) {
				useNotify({
					message: 'Môn học không thể trùng lặp trong một ngày',
					type: 'warning',
				});
				return false;
			} else {
				return true;
			}
		} else {
			//Trường hợp có tiết đôi

			//Đếm số tiết đã chọn có cùng ngày học
			const numOfSameDaySelected: number[] = selectedCells.filter(
				(id) => Math.floor((id - 1) / 10) === weekdayId
			);
			if (numOfSameDaySelected.length >= 2) {
				useNotify({
					message: 'Đã phân công số tiết tối đa một ngày',
					type: 'warning',
				});
				return false;
			} else if (numOfSameDaySelected.length === 1) {
				if (Math.abs(numOfSameDaySelected[0] - cellId) !== 1) {
					useNotify({
						message: 'Không thể xếp tiết đôi ngắt quãng',
						type: 'warning',
					});
					return false;
				} else {
					return true;
				}
			} else {
				return true;
			}
		}
	};

	// Check xem giáo viên đảm nhiệm môn này có dạy được slot này không
	const isOccupiedSlot = (cellId: number): boolean => {
		// Lấy ra các slot mà giáo viên đã dạy
		if (open && dataStored && dataStored['fixed-periods-para']) {
			const occupiedSlots: IFixedPeriodObject[] = dataStored['fixed-periods-para'].filter(
				(item) =>
					item['teacher-id'] === selectedObject.teacherId &&
					item['class-id'] !== selectedObject.classId
			);
			if (occupiedSlots.length > 0) {
				if (occupiedSlots.some((item) => item['start-at'] === cellId)) {
					return true;
				} else return false;
			}
		}
		return false;
	};

	// Check có phải tiết trống cố định không
	const isFreePeriod = (cellId: number): boolean => {
		if (open && dataStored && dataStored['free-timetable-periods-para']) {
			const freeSlots: IFreePeriodObject[] = dataStored['free-timetable-periods-para'].filter(
				(item) => item['class-id'] === selectedObject.classId
			);
			if (freeSlots.length > 0) {
				if (freeSlots.some((item) => item['start-at'] === cellId)) {
					return true;
				} else return false;
			}
		}
		return false;
	};

	// Check xem giáo viên có nghỉ lịch này không
	const isTeacherUnavailability = (cellId: number): boolean => {
		if (open && dataStored && dataStored['no-assign-periods-para']) {
			const unavalabilitySlots: INoAssignPeriodObject[] = dataStored[
				'no-assign-periods-para'
			].filter((item) => item['teacher-id'] === selectedObject.teacherId);
			if (unavalabilitySlots.length > 0) {
				if (unavalabilitySlots.some((item) => item['start-at'] === cellId)) {
					return true;
				} else return false;
			}
		}

		return false;
	};

	const handleSelectCell = (cellId: number) => {
		const existingSlot = getExistingSlot(data ?? [], cellId);
		if (existingSlot && !(selectedObject?.slots === existingSlot?.slots)) {
			useNotify({
				message: 'Tiết này đã được phân công cho môn khác',
				type: 'warning',
			});
		} else if (selectedCells.length < selectedObject.totalSlotPerWeek) {
			if (isValidSlotInSession(cellId) && isValidSelectedSlotInDay(cellId)) {
				setSelectedCells([...selectedCells, cellId]);
			}
		} else {
			if (selectedCells.includes(cellId)) {
				setSelectedCells(selectedCells.filter((id) => id !== cellId));
			} else {
				useNotify({
					message: 'Đã phân công số tiết tối đa cho môn học này',
					type: 'warning',
				});
			}
		}
	};

	const handleSaveResult = async () => {
		if (dataStored && dataStored.id && dataFirestoreName) {
			let newResult = [];
			newResult = useFilterArray(
				[
					...dataStored['fixed-periods-para'].filter(
						(item: IFixedPeriodObject) =>
							item['class-id'] !== selectedObject.classId ||
							item['subject-id'] !== selectedObject.subjectId ||
							selectedCells.includes(item['start-at'])
					),
					...selectedCells.map(
						(cellId: number) =>
							({
								'class-id': selectedObject.classId,
								'subject-id': selectedObject.subjectId,
								'start-at': cellId,
								'teacher-id': selectedObject.teacherId,
							} as IFixedPeriodObject)
					),
				],
				['subject-id', 'class-id', 'start-at']
			);
			const docRef = doc(firestore, dataFirestoreName, dataStored.id);
			await setDoc(
				docRef,
				{
					...dataStored,
					'fixed-periods-para': newResult,
				} as IConfigurationStoreObject,
				{ merge: true }
			);
			dispatch(updateDataStored({ target: 'fixed-periods-para', value: newResult }));
			useNotify({
				message: 'Phân công tiết thành công',
				type: 'success',
			});
			handleClose();
		}
	};

	return (
		<Modal
			disableEnforceFocus
			disableAutoFocus
			disableRestoreFocus
			open={open}
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
						className='text-title-small-strong font-normal opacity-60'
					>
						Xếp tiết môn {selectedObject.subjectName}
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='w-full h-fit min-h-[40vh] p-3'>
					<p className='italic text-body-small opacity-80 pb-2'>
						(*) Môn học có{' '}
						<strong
							className={`font-bold ${
								selectedObject.totalMainSlotsPerWeek !== 0
									? 'text-primary-400'
									: 'text-tertiary-normal'
							}`}
						>
							{selectedObject.totalMainSlotsPerWeek}
						</strong>{' '}
						tiết học chính khóa và{' '}
						<strong
							className={`font-bold ${
								selectedObject.totalSubSlotsPerWeek !== 0
									? 'text-primary-400'
									: 'text-tertiary-normal'
							}`}
						>
							{selectedObject.totalSubSlotsPerWeek}
						</strong>{' '}
						tiết học trái buổi
					</p>
					<TableContainer sx={{ maxWidth: 900, margin: 'auto' }}>
						{/* <Table onMouseUp={handleMouseUp} size='small' onMouseLeave={handleMouseUp}> */}
						<Table size='small'>
							<TableHead>
								<TableRow>
									<TableCell
										align='center'
										sx={{
											fontWeight: 'bold',
											width: 80,
											border: '1px solid #ddd',
										}}
									>
										Buổi
									</TableCell>
									<TableCell
										align='center'
										sx={{
											fontWeight: 'bold',
											width: 80,
											border: '1px solid #ddd',
										}}
									>
										Tiết
									</TableCell>
									{WEEK_DAYS.map((day) => (
										<TableCell
											key={day}
											align='center'
											sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}
										>
											{day}
										</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{TIMETABLE_SLOTS.map((session, sessionIndex) => (
									<>
										{session.slots.map((slot, slotIndex) => (
											<TableRow key={`${session.period}-${slot}`}>
												{slotIndex === 0 && (
													<TableCell
														rowSpan={session.slots.length}
														align='center'
														sx={{
															fontWeight: 'bold',
															border: '1px solid #ddd',
															width: 100,
															p: 0,
															m: 0,
														}}
													>
														<div className='w-full  flex flex-col justify-center items-center'>
															<h1 className='w-full text-center'>{session.period}</h1>
															<p className='text-body-small font-light w-full text-center'>
																({mainSession === sessionIndex ? 'Chính khóa' : 'Trái buổi'})
															</p>
														</div>
													</TableCell>
												)}
												<TableCell align='center'>{slot}</TableCell>
												{WEEK_DAYS.map((day: string, weekdayIndex: number) => {
													const cellId = weekdayIndex * 10 + sessionIndex * 5 + slotIndex + 1;
													const existingSlot = getExistingSlot(data ?? [], cellId);
													return (
														<TableCell
															key={cellId}
															align='center'
															sx={[
																{
																	m: 0,
																	p: 0,
																	cursor:
																		isValidSlot(
																			mainSession,
																			sessionIndex * 5 + slotIndex + 1,
																			selectedObject.totalSubSlotsPerWeek !== 0,
																			selectedObject.totalMainSlotsPerWeek === 0 &&
																				selectedObject.totalSubSlotsPerWeek > 0
																		) &&
																		!isOccupiedSlot(cellId) &&
																		!isFreePeriod(cellId) &&
																		!isTeacherUnavailability(cellId)
																			? 'pointer'
																			: 'not-allowed',
																	userSelect: 'none',
																	border: '1px solid #ddd',
																	':hover': {
																		backgroundColor: '#f0f0f0',
																	},
																	bgcolor:
																		isValidSlot(
																			mainSession,
																			sessionIndex * 5 + slotIndex + 1,
																			selectedObject.totalSubSlotsPerWeek !== 0,
																			selectedObject.totalMainSlotsPerWeek === 0 &&
																				selectedObject.totalSubSlotsPerWeek > 0
																		) &&
																		!isOccupiedSlot(cellId) &&
																		!isFreePeriod(cellId) &&
																		!isTeacherUnavailability(cellId)
																			? '#fff'
																			: '#f0f0f0',
																	minWidth: 60,
																	maxWidth: 60,
																	minHeight: 40,
																	height: 40,
																	maxHeight: 40,
																},
																selectedCells.includes(cellId) && { bgcolor: '#e6edf3' },
															]}
															onClick={() => {
																if (
																	isValidSlot(
																		mainSession,
																		sessionIndex * 5 + slotIndex + 1,
																		selectedObject.totalSubSlotsPerWeek !== 0,
																		selectedObject.totalMainSlotsPerWeek === 0 &&
																			selectedObject.totalSubSlotsPerWeek > 0
																	)
																) {
																	if (
																		!isOccupiedSlot(cellId) &&
																		!isFreePeriod(cellId) &&
																		!isTeacherUnavailability(cellId)
																	) {
																		handleSelectCell(cellId);
																	}
																} else {
																	useNotify({
																		message: 'Không thể phân công môn này vào tiết trái buổi',
																		type: 'warning',
																	});
																}
															}}
														>
															{isOccupiedSlot(cellId) && (
																<LightTooltip title='Giáo viên đảm nhiệm có lịch dạy tiết này ở lớp khác'>
																	<div className='w-full h-[0]'></div>
																</LightTooltip>
															)}
															{isFreePeriod(cellId) && (
																<LightTooltip title='Tiết trống cố định'>
																	<div className='w-full h-[0]'></div>
																</LightTooltip>
															)}
															{isTeacherUnavailability(cellId) && (
																<LightTooltip title='Lịch nghỉ của giáo viên đảm nhiệm bộ môn'>
																	<div className='w-full h-[0]'></div>
																</LightTooltip>
															)}
															{existingSlot && !(selectedObject?.slots === existingSlot?.slots) && (
																<LightTooltip title={existingSlot.subjectName}>
																	<div className='w-full h-full flex flex-col justify-center items-center px-1'>
																		<p className='w-full overflow-hidden text-ellipsis whitespace-nowrap font-semibold'>
																			{existingSlot.subjectName}
																		</p>
																		<p>{existingSlot.teacherName}</p>
																	</div>
																</LightTooltip>
															)}
															{selectedCells.includes(cellId) && (
																<LightTooltip title={selectedObject.subjectName}>
																	<div className='w-full h-full flex flex-col justify-center items-center px-1'>
																		<p className='text-body-small-strong font-semibold text-center w-full overflow-hidden text-ellipsis whitespace-nowrap'>
																			{selectedObject.subjectName}
																		</p>
																		<p className='text-body-small text-center w-full'>
																			{selectedObject.teacherName}
																		</p>
																	</div>
																</LightTooltip>
															)}
														</TableCell>
													);
												})}
											</TableRow>
										))}
										{sessionIndex === 0 && (
											<TableRow key={sessionIndex}>
												<TableCell colSpan={WEEK_DAYS.length - 1}></TableCell>
											</TableRow>
										)}
									</>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</div>
				<div
					id='modal-footer'
					className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'
				>
					<ContainedButton
						title='Huỷ'
						onClick={handleClose}
						disableRipple
						styles='!bg-basic-gray-active !text-basic-gray !py-1 px-4'
					/>
					<ContainedButton
						title='Lưu thay đổi'
						disableRipple
						type='button'
						styles='bg-primary-300 text-white !py-1 px-4'
						onClick={handleSaveResult}
					/>
				</div>
			</Box>
		</Modal>
	);
};

export default FixedPeriodEditModal;

'use client';
import ContainedButton from '@/commons/button-contained';
import { ITimetableGenerationState, updateDataStored } from '@/context/slice_timetable_generation';
import useNotify from '@/hooks/useNotify';
import { TIMETABLE_SLOTS, WEEK_DAYS } from '@/utils/constants';
import { firestore } from '@/utils/firebaseConfig';
import CloseIcon from '@mui/icons-material/Close';
import {
	Box,
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
import { doc, setDoc } from 'firebase/firestore';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IConfigurationStoreObject, IFixedPeriodObject } from '../../../_libs/constants';
import { ITeachersLessonsObject } from '../_libs/constants';
import useFilterArray from '@/hooks/useFilterArray';

const getExistingSlot = (
	data: ITeachersLessonsObject[],
	slotId: number
): ITeachersLessonsObject | undefined => {
	const existingSlot: ITeachersLessonsObject | undefined = data.find((item) =>
		item.slots.includes(slotId)
	);
	return existingSlot;
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
}

const FixedPeriodAssignmentModal = (props: IFixedPeriodAssignmentProps) => {
	const { selectedObject, open, setOpen, data } = props;
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

	const handleSelectCell = (cellId: number) => {
		if (selectedCells.length < selectedObject.totalSlotPerWeek) {
			if (selectedCells.includes(cellId)) {
				setSelectedCells(selectedCells.filter((id) => id !== cellId));
			} else {
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

	const handleConfirmAssignment = async () => {
		if (dataStored && dataStored.id && dataFirestoreName) {
			let newResult = [];
			if (selectedCells.length < selectedObject.slots.length) {
				const tmpRemovedSlots = selectedObject.slots.filter(
					(slot) => !selectedCells.includes(slot)
				);
				newResult = dataStored['fixed-periods-para'].filter(
					(item: IFixedPeriodObject) =>
						item['class-id'] !== selectedObject.classId ||
						item['subject-id'] !== selectedObject.subjectId ||
						!tmpRemovedSlots.includes(item['start-at'])
				);
			} else {
				newResult = useFilterArray(
					[
						...dataStored['fixed-periods-para'],
						...selectedCells.map(
							(cellId: number) =>
								({
									'class-id': selectedObject.classId,
									'subject-id': selectedObject.subjectId,
									'start-at': cellId,
								} as IFixedPeriodObject)
						),
					],
					['subject-id', 'class-id', 'start-at']
				);
			}
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
					<TableContainer component={Paper} sx={{ maxWidth: 900, margin: 'auto' }}>
						{/* <Table onMouseUp={handleMouseUp} size='small' onMouseLeave={handleMouseUp}> */}
						<Table size='small'>
							<TableHead>
								<TableRow>
									<TableCell
										align='center'
										sx={{ fontWeight: 'bold', width: 80 }}
									>
										Buổi
									</TableCell>
									<TableCell
										align='center'
										sx={{ fontWeight: 'bold', width: 80 }}
									>
										Tiết
									</TableCell>
									{WEEK_DAYS.map((day) => (
										<TableCell
											key={day}
											align='center'
											sx={{ fontWeight: 'bold' }}
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
														}}
													>
														{session.period}
													</TableCell>
												)}
												<TableCell align='center'>{slot}</TableCell>
												{WEEK_DAYS.map(
													(day: string, weekdayIndex: number) => {
														const cellId =
															weekdayIndex * 10 +
															sessionIndex * 5 +
															slotIndex +
															1;
														const existingSlot = getExistingSlot(
															data ?? [],
															cellId
														);
														return (
															<TableCell
																key={cellId}
																align='center'
																sx={[
																	{
																		m: 0,
																		p: 0,
																		cursor: 'pointer',
																		userSelect: 'none',
																		border: '1px solid #ddd',
																		':hover': {
																			backgroundColor:
																				'#f0f0f0',
																		},
																		width: 60,
																		maxWidth: 60,
																		height: 50,
																		maxHeight: 50,
																	},
																	selectedCells.includes(
																		cellId
																	) && { bgcolor: '#e6edf3' },
																]}
																onClick={() =>
																	handleSelectCell(cellId)
																}
															>
																{existingSlot &&
																	!(
																		selectedObject?.slots ===
																		existingSlot?.slots
																	) &&
																	`${existingSlot.subjectName} - ${existingSlot.teacherName}`}
																{selectedCells.includes(cellId) && (
																	<div className='w-full h-full flex flex-col justify-center items-center'>
																		<p className='text-body-small-strong font-semibold text-center w-full'>
																			{
																				selectedObject.subjectName
																			}
																		</p>
																		<p className='text-body-small text-center w-full'>
																			{
																				selectedObject.teacherName
																			}
																		</p>
																	</div>
																)}
															</TableCell>
														);
													}
												)}
											</TableRow>
										))}
										{sessionIndex === 0 && (
											<TableRow key={sessionIndex}>
												<TableCell
													colSpan={WEEK_DAYS.length - 1}
												></TableCell>
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
						onClick={handleConfirmAssignment}
					/>
				</div>
			</Box>
		</Modal>
	);
};

export default FixedPeriodAssignmentModal;

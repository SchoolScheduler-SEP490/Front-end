'use client';
import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import ContainedButton from '@/commons/button-contained';
import {
	ITimetableGenerationState,
	setGeneratedScheduleStored,
} from '@/context/slice_timetable_generation';
import useNotify from '@/hooks/useNotify';
import { IClassPeriod, IClassSchedule, IScheduleResponse } from '@/utils/constants';
import { firestore } from '@/utils/firebaseConfig';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, IconButton, MenuItem, Modal, TextField, Typography } from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IPeriodDisplayData, ISwitchPeriod, ITimetableDisplayData } from '../_libs/constants';
import TeacherSelectTable from './modal/table_teacher_select';
import TeacherSelectUnavailabilityTable from './modal/table_teacher_select_unavailability';
import TeacherTargetTable from './modal/table_teacher_target';
import TeacherTargetUnavailabilityTable from './modal/table_teacher_target_unavailability';
import TimetableCancelConfirmModal from './timetable_modal_close_confirm';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '80vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

interface ITimetableEditModalProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	data: ITimetableDisplayData[];
}

const TimetableEditModal = (props: ITimetableEditModalProps) => {
	const { open, setOpen, data } = props;
	const {
		generatedScheduleStored,
		timetableStored,
		generatedScheduleFirestorename,
	}: ITimetableGenerationState = useSelector((state: any) => state.timetableGeneration);
	const dispatch = useDispatch();

	const [selectedSession, setSelectedSession] = useState<number>(0);
	const [selectedClassId, setSelectedClassId] = useState<number>(0);
	const [selectedClassData, setSelectedClassData] = useState<IPeriodDisplayData[]>([]);

	const [selectedSlot, setSelectedSlot] = useState<ISwitchPeriod | null>(null);
	const [selectedTarget, setSelectedTarget] = useState<ISwitchPeriod | null>(null);

	const [selectedSlotUnavailability, setSelectedSlotUnavailability] = useState<
		IPeriodDisplayData[]
	>([]);
	const [isWarning, setIsWarning] = useState<boolean>(false);
	const [isCloseConfirmModalOpen, setIsCloseConfirmModalOpen] = useState<boolean>(false);

	const [editingData, setEditingData] = useState<ITimetableDisplayData[]>([]);
	const [classOptions, setClassOptions] = useState<IDropdownOption<number>[]>([]);
	const [sessionOptions, setSessionOptions] = useState<IDropdownOption<number>[]>([]);
	const [mainSession, setMainSession] = useState<number>(0);

	useEffect(() => {
		if (data.length > 0) {
			setEditingData(data);
		}
	}, [data, open]);

	useEffect(() => {
		// Tạo option cho buổi (chính khóa và trái buổi)
		const generateSessionOptions = (mainSession: number) => {
			const options: IDropdownOption<number>[] = [
				{ label: 'Chính khóa', value: mainSession },
				{ label: 'Trái buổi', value: Math.abs(mainSession - 1) },
			];
			setSessionOptions(options);
			setSelectedSession(mainSession);
		};

		// Clear data phase
		setSelectedSlot(null);
		setSelectedTarget(null);

		if (open && editingData) {
			let tmpClassData: ITimetableDisplayData | undefined = undefined;

			// Chọn lớp đầu tiên hoặc là lớp đang truyền để lấy dữ liệu của lớp đó
			if (selectedClassId !== 0) {
				tmpClassData = editingData.find(
					(item: ITimetableDisplayData) => item.classId === selectedClassId
				);
			} else {
				tmpClassData = editingData[0];
			}

			// Nếu có dữ liệu lớp thì set dữ liệu lớp và tạo option cho buổi
			if (tmpClassData) {
				if (sessionOptions.length === 0 || selectedClassId === 0) {
					setSelectedClassId(tmpClassData.classId);
					setMainSession(tmpClassData.mainSessionId);
					generateSessionOptions(tmpClassData.mainSessionId);
				}
				setSelectedClassData(tmpClassData.periods);
			}

			// Tạo option để người dùng chọn lớp
			const tmpClassOptions: IDropdownOption<number>[] = data.map(
				(item: ITimetableDisplayData) =>
					({
						label: item.className,
						value: item.classId,
					} as IDropdownOption<number>)
			);
			if (tmpClassOptions.length > 0) {
				setClassOptions(tmpClassOptions);
			}
		}
	}, [open, selectedClassId, selectedSession, editingData]);

	const handleClearData = () => {
		setOpen(false);
		setSelectedClassId(0);
		setSelectedSession(0);
		setSelectedClassData([]);
		setSelectedSlot(null);
		setSelectedTarget(null);
		setSelectedSlotUnavailability([]);
		setIsWarning(false);
		setEditingData([]);
		setClassOptions([]);
		setSessionOptions([]);
	};

	const handleClose = () => {
		handleClearData();
		setIsCloseConfirmModalOpen(false);
	};

	const handleUpdateData = () => {
		if (editingData.length > 0) {
			const updatedData: ITimetableDisplayData[] = editingData.map(
				(item: ITimetableDisplayData) => {
					if (item.classId === selectedClassId) {
						const updatedPeriods: IPeriodDisplayData[] = [];
						// Handle trườngg hợp nếu chọn target là tiết trống thì thêm trước tiết selected vào
						// vì trong forEach ở dưới không thể tìm thấy tiết target vì tiết target trống
						if (!item.periods.some((item) => item.slot === selectedTarget?.slot)) {
							updatedPeriods.push({
								...selectedSlot,
								slot: selectedTarget?.slot,
							} as IPeriodDisplayData);
						}
						item.periods.forEach((period: IPeriodDisplayData) => {
							// Đổi tiết đã chọn
							if (period.slot === selectedSlot?.slot) {
								updatedPeriods.push({
									...({ ...selectedTarget } as IPeriodDisplayData),
									slot: period.slot,
								});
							} else if (period.slot === selectedTarget?.slot) {
								updatedPeriods.push({
									...({ ...selectedSlot } as IPeriodDisplayData),
									slot: period.slot,
								});
							} else {
								updatedPeriods.push(period);
							}
						});
						return {
							...item,
							periods:
								selectedTarget?.teacherId === 0 && selectedTarget?.subjectId === 0
									? updatedPeriods.filter((item) => item.slot !== selectedSlot?.slot)
									: updatedPeriods,
						};
					} else {
						return item;
					}
				}
			);
			if (updatedData.length > 0) {
				setEditingData(updatedData);
			}
		}
	};

	const handleApplyChanges = async () => {
		if (editingData.length > 0) {
			const updatedDocumentData: IScheduleResponse = {
				...generatedScheduleStored,
				'class-schedules': generatedScheduleStored['class-schedules'].map(
					(clazz: IClassSchedule) => {
						const updatedClass: ITimetableDisplayData | undefined = editingData.find(
							(item: ITimetableDisplayData) => item.classId === clazz['student-class-id']
						);
						if (updatedClass) {
							const updatedPeriods: IClassPeriod[] = clazz['class-periods'].map(
								(period: IClassPeriod) => {
									const updatedPeriod: IPeriodDisplayData | undefined = updatedClass.periods.find(
										(item: IPeriodDisplayData) => item.slot === period['start-at']
									);
									if (updatedPeriod) {
										return {
											...period,
											'teacher-id': updatedPeriod.teacherId,
											'teacher-abbreviation': updatedPeriod.teacherName,
											'subject-id': updatedPeriod.subjectId,
											'subject-abbreviation': updatedPeriod.subjectAbbreviation,
											'start-at': updatedPeriod.slot,
										} as IClassPeriod;
									} else {
										const newPeriod: IPeriodDisplayData | undefined = updatedClass.periods.find(
											(item: IPeriodDisplayData) =>
												item.subjectId === period['subject-id'] &&
												!clazz['class-periods'].some((cpItem) => cpItem['start-at'] === item.slot)
										);
										if (newPeriod) {
											return {
												...period,
												'teacher-id': newPeriod.teacherId,
												'teacher-abbreviation': newPeriod.teacherName,
												'subject-id': newPeriod.subjectId,
												'subject-abbreviation': newPeriod.subjectAbbreviation,
												'start-at': newPeriod.slot,
											} as IClassPeriod;
										}
									}
									return period;
								}
							);
							return {
								...clazz,
								'class-periods': updatedPeriods,
							} as IClassSchedule;
						}
						return clazz;
					}
				),
			};
			if (
				timetableStored &&
				timetableStored['generated-schedule-id'] &&
				generatedScheduleFirestorename
			) {
				const docRef = doc(
					firestore,
					generatedScheduleFirestorename,
					timetableStored['generated-schedule-id']
				);
				await setDoc(docRef, updatedDocumentData, { merge: true });
				dispatch(setGeneratedScheduleStored(updatedDocumentData));
				useNotify({
					type: 'success',
					message: 'Cập nhật tiết học thành công',
				});
			}
		}
	};

	return (
		<Modal
			disableEnforceFocus
			disableAutoFocus
			disableRestoreFocus
			open={open}
			onClose={() => setIsCloseConfirmModalOpen(true)}
			aria-labelledby='keep-mounted-modal-title'
			aria-describedby='keep-mounted-modal-description'
		>
			<Box sx={style}>
				<div
					id='modal-header'
					className='w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3 py-1'
				>
					<Typography
						variant='h6'
						component='h2'
						className='text-title-medium-strong font-normal opacity-60'
					>
						Điều chỉnh Thời khóa biểu
					</Typography>
					<IconButton onClick={() => setIsCloseConfirmModalOpen(true)}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='w-full h-fit max-h-[85vh] flex flex-col justify-start items-center p-3'>
					<div className='relative w-full h-fit flex flex-row justify-center items-center gap-5'>
						<TextField
							select
							label='Chọn lớp'
							value={selectedClassId}
							defaultValue={selectedClassId}
							variant='outlined'
							onChange={(event) => setSelectedClassId(Number(event.target.value))}
							sx={{ width: '20%' }}
							InputProps={{
								sx: {
									height: 45,
									paddingTop: '2px',
								},
							}}
						>
							{classOptions.map((option: IDropdownOption<number>, index: number) => (
								<MenuItem value={option.value} key={index}>
									{option.label}
								</MenuItem>
							))}
						</TextField>
						<TextField
							select
							label='Chọn buổi'
							value={selectedSession}
							defaultValue={selectedSession}
							variant='outlined'
							onChange={(event) => setSelectedSession(Number(event.target.value))}
							sx={{ width: '20%' }}
							InputProps={{
								sx: {
									height: 45,
									paddingTop: '2px',
								},
							}}
						>
							{sessionOptions.map((option: IDropdownOption<number>, index: number) => (
								<MenuItem value={option.value} key={index}>
									{option.label}
								</MenuItem>
							))}
						</TextField>
						{selectedSlot && selectedTarget && (
							<div className='w-[10vw] absolute top-[50%] right-[0%] -translate-y-[50%]'>
								<Button
									variant='contained'
									color='success'
									disabled={isWarning}
									onClick={handleUpdateData}
									sx={{ width: '100%', borderRadius: 0, boxShadow: 'none' }}
								>
									<Typography variant='body1' sx={{ color: 'primary.500' }}>
										Đổi
									</Typography>
								</Button>
							</div>
						)}
					</div>
					<div className='w-full h-fit flex flex-row justify-between items-start gap-2 mb-1'>
						{/* Bảng chứa thông tin lớp học để người dùng chọn tiết muốn đổi */}
						<div className='w-[48%] h-fit flex flex-col justify-start items-start'>
							<p className='text-body-small italic opacity-80 pl-5 py-2'>
								(*) Chọn một tiết cần đổi (không thể chọn tiết trống)
							</p>
							<TeacherSelectTable
								data={selectedClassData}
								isMainSession={selectedSession === mainSession}
								session={selectedSession}
								selectedSlot={selectedSlot}
								setSelectedSlot={setSelectedSlot}
								selectedTarget={selectedTarget}
								setSelectedTarget={setSelectedTarget}
							/>
						</div>
						<div className='w-[48%] h-fit flex flex-col justify-start items-start'>
							<p className='text-body-small italic opacity-80 pl-5 py-2'>
								(*) Chọn một tiết muốn đổi với tiết đã chọn (có thể chọn tiết trống)
							</p>
							<TeacherTargetTable
								data={editingData}
								classData={selectedClassData}
								isMainSession={selectedSession === mainSession}
								session={selectedSession}
								selectedSlot={selectedSlot}
								setSelectedSlot={setSelectedSlot}
								selectedTarget={selectedTarget}
								setSelectedTarget={setSelectedTarget}
								selectedSlotUnavailability={selectedSlotUnavailability}
							/>
						</div>
					</div>
					<div className='w-full h-fit flex flex-row justify-between items-start gap-2 mb-1'>
						<div className='w-[48%] h-fit flex flex-col justify-start items-start'>
							<p className='text-body-small italic opacity-80 pl-5 py-2'>
								(*) Lịch dạy của giáo viên{' '}
								<strong className='text-basic-negative font-bold text-body'>
									{selectedSlot?.teacherName ?? ''}
								</strong>
							</p>
							<TeacherSelectUnavailabilityTable
								data={editingData}
								isMainSession={selectedSession === mainSession}
								session={selectedSession}
								classId={selectedClassId}
								selectedSlot={selectedSlot}
								selectedTarget={selectedTarget}
								setSelectedSlotUnavailability={setSelectedSlotUnavailability}
								setIsWarning={setIsWarning}
							/>
						</div>
						<div className='w-[48%] h-fit flex flex-col justify-start items-start'>
							<p className='text-body-small italic opacity-80 pl-5 py-2'>
								(*) Lịch dạy của giáo viên{' '}
								<strong className='text-basic-positive font-bold text-body'>
									{selectedTarget?.subjectId !== 0 ? selectedTarget?.teacherName : ''}
								</strong>
							</p>
							<TeacherTargetUnavailabilityTable
								data={editingData}
								isMainSession={selectedSession === mainSession}
								session={selectedSession}
								classId={selectedClassId}
								selectedTarget={selectedTarget}
								selectedSlot={selectedSlot}
								setIsWarning={setIsWarning}
							/>
						</div>
					</div>
				</div>
				<div
					id='modal-footer'
					className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'
				>
					<ContainedButton
						title='Huỷ'
						onClick={() => setIsCloseConfirmModalOpen(true)}
						disableRipple
						styles='!bg-basic-gray-active !text-basic-gray !py-1 px-4'
					/>
					<ContainedButton
						title='áp dụng'
						disableRipple
						type='button'
						styles='bg-primary-300 text-white !py-1 px-4'
						onClick={handleApplyChanges}
					/>
				</div>
				<TimetableCancelConfirmModal
					open={isCloseConfirmModalOpen}
					setOpen={setIsCloseConfirmModalOpen}
					handleApprove={handleClose}
				/>
			</Box>
		</Modal>
	);
};

export default TimetableEditModal;

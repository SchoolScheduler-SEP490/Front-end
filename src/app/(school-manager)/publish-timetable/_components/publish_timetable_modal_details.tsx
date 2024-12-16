import ContainedButton from '@/commons/button-contained';
import { useAppContext } from '@/context/app_provider';
import CloseIcon from '@mui/icons-material/Close';
import {
	Box,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Modal,
	Select,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { IDropdownOption } from '../../_utils/contants';
import useFetchAvailableRooms from '../_hooks/useFetchAvailableRoom';
import useFetchAvailableTeachers from '../_hooks/useFetchAvailableTeacher';
import {
	IAvailableRoomResponse,
	IAvailableTeacherResponse,
	IExtendedDropdownOption,
	IPeriodProcessData,
	IUpdateTimetableRequest,
} from '../_libs/constants';
import useGetSlotDetails from '../_hooks/useGetSlotDetails';
import { getUpdateTimetableApi } from '../_libs/apiPublish';
import useNotify from '@/hooks/useNotify';
import { KeyedMutator } from 'swr';
import PublishTimetableConfirmModal from './publish_timetable_modal_confirm';
import dayjs from 'dayjs';
import useFetchWeekDays from '../_hooks/useFetchWeekdays';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '25vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

interface IPublishTimetableDetailsModalProps {
	open: boolean;
	setOpen: (status: boolean) => void;
	selectedSlot: IPeriodProcessData | null;
	selectedDate: string;
	selectedTermId: number;
	updateData: KeyedMutator<any>;
	weekdayOptions: IExtendedDropdownOption<string>[];
}

const TRANSLATOR = {
	Fixed: 'Tiết cố định',
	Double: 'Tiết đôi',
	Combination: 'Tiết lớp ghép',
	Medium: 'Trung bình',
	Low: 'Thấp',
	None: 'Tiết thường',
};

const PublishTimetableDetailsModal = (props: IPublishTimetableDetailsModalProps) => {
	const { open, setOpen, selectedSlot, selectedDate, selectedTermId, updateData, weekdayOptions } =
		props;
	const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();

	const [teacherOptions, setTeacherOptions] = useState<IDropdownOption<number>[]>([]);
	const [roomOptions, setRoomOptions] = useState<IDropdownOption<number>[]>([]);
	const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
	const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);

	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

	const { data: weekdayData, mutate: updateWeekdayData } = useFetchWeekDays({
		schoolId: Number(schoolId),
		sessionToken,
		termId: selectedTermId,
		yearId: selectedSchoolYearId,
	});

	const { data: availableTeachers, mutate: updateAvailableTeachers } = useFetchAvailableTeachers({
		schoolId: Number(schoolId),
		yearId: selectedSchoolYearId,
		sessionToken,
		classPeriodId: selectedSlot?.periodId ?? 0,
		day: selectedDate,
		slot: selectedSlot?.slot ?? 0,
		termId: selectedTermId,
	});

	const { data: availableRooms, mutate: updateAvailableRooms } = useFetchAvailableRooms({
		schoolId: Number(schoolId),
		yearId: selectedSchoolYearId,
		sessionToken,
		classPeriodId: selectedSlot?.periodId ?? 0,
		day: selectedDate,
		slot: selectedSlot?.slot ?? 0,
		termId: selectedTermId,
	});

	useEffect(() => {
		updateAvailableRooms();
		if (availableRooms?.status === 200) {
			const tmpRoomOptions: IDropdownOption<number>[] = availableRooms.result[
				'available-rooms'
			].map(
				(room: IAvailableRoomResponse) =>
					({
						label: room['room-code'],
						value: room['room-id'],
					} as IDropdownOption<number>)
			);
			if (!tmpRoomOptions.some((option) => option.value === selectedSlot?.roomId)) {
				tmpRoomOptions.push({
					label: selectedSlot?.roomName ?? '',
					value: selectedSlot?.roomId ?? 0,
				});
			}
			setRoomOptions(tmpRoomOptions.sort((a, b) => a.label.localeCompare(b.label)));
			setSelectedRoom(selectedSlot?.roomId ?? null);
		}
	}, [availableRooms, open]);

	useEffect(() => {
		updateAvailableTeachers();
		if (availableTeachers?.status === 200) {
			const tmpTeacherOptions: IDropdownOption<number>[] = availableTeachers.result[
				'available-teachers'
			].map(
				(teacher: IAvailableTeacherResponse) =>
					({
						label: `${teacher['first-name']} ${teacher['last-name']}`,
						value: teacher['teacher-id'],
					} as IDropdownOption<number>)
			);
			if (!tmpTeacherOptions.some((option) => option.value === selectedSlot?.teacherId)) {
				tmpTeacherOptions.push({
					label: selectedSlot?.teacherName ?? '',
					value: selectedSlot?.teacherId ?? 0,
				});
			}
			setTeacherOptions(tmpTeacherOptions.sort((a, b) => a.label.localeCompare(b.label)));
			setSelectedTeacher(selectedSlot?.teacherId ?? null);
		}
	}, [availableTeachers, open]);

	const handleClose = () => {
		setOpen(false);
		setRoomOptions([]);
		setTeacherOptions([]);
		setSelectedRoom(null);
		setSelectedTeacher(null);
		setIsConfirmModalOpen(false);
	};

	const handleApplyChanges = async (isPermanent: boolean) => {
		const endpoint = getUpdateTimetableApi({
			schoolId: Number(schoolId),
			yearId: selectedSchoolYearId,
		});
		const response = await fetch(endpoint, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${sessionToken}`,
			},
			body: JSON.stringify([
				{
					'class-period-id': selectedSlot?.periodId,
					'start-at': selectedSlot?.slot,
					'room-id': selectedRoom,
					'teacher-id': selectedTeacher,
					'is-change-forever': isPermanent,
					week:
						weekdayOptions.find((option) => dayjs(selectedDate).isBefore(dayjs(option.max)))
							?.extra ?? 0,
				} as IUpdateTimetableRequest,
			]),
		});
		if (response.ok) {
			const data = await response.json();
			useNotify({
				message: data.message,
				type: 'success',
			});
			updateData();
			handleClose();
		} else {
			const data = await response.json();
			useNotify({
				message: data.message,
				type: 'error',
			});
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
					className='w-full h-fit flex flex-row justify-between items-center p-2 pl-5'
				>
					<Typography
						variant='h6'
						component='h2'
						className='text-title-large-strong font-semibold !opacity-80'
					>
						Thông tin tiết học
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='p-4 pl-5'>
					{selectedSlot && (
						<div className='w-full h-fit flex flex-row justify-between items-start'>
							<div className='w-fit flex flex-col justify-start items-start gap-2'>
								<Typography>
									<strong>Lớp:</strong> {selectedSlot.className}
								</Typography>
								<Typography>
									<strong>Tiết:</strong> {useGetSlotDetails(selectedSlot.slot, false)}
								</Typography>
								<Typography>
									<strong>Môn học:</strong> {selectedSlot.subjectAbbreviation}
								</Typography>
							</div>
							<div className='w-fit flex flex-col justify-start items-start gap-2'>
								<Typography>
									<strong>Giáo viên:</strong> {selectedSlot.teacherName}
								</Typography>
								<Typography>
									<strong>Phòng học:</strong> {selectedSlot.roomName}
								</Typography>
								<Typography>
									<strong>Loại tiết: </strong> {TRANSLATOR[selectedSlot.priority]}
								</Typography>
							</div>
						</div>
					)}

					{selectedSlot?.priority === 'Double' && (
						<p className='text-body-small italic opacity-80 text-basic-negative pt-2'>
							(*) Đối với tiết đôi nên cập nhật cả 2 tiết để tránh gây sai sót
						</p>
					)}
					{/* Dropdown chọn Room */}
					<Box mt={3}>
						<FormControl fullWidth>
							<InputLabel>Tên phòng</InputLabel>
							<Select
								value={selectedRoom ?? ''}
								onChange={(e) => setSelectedRoom(Number(e.target.value))}
								displayEmpty
								disabled={!dayjs().isAfter(dayjs(selectedDate))}
								variant='outlined'
								renderValue={(selected) =>
									roomOptions.find((item) => item.value === selected)?.label ?? ''
								}
							>
								{roomOptions.map((room) => (
									<MenuItem key={room.value} value={room.value}>
										{room.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					{/* Dropdown chọn Teacher */}
					<Box mt={3}>
						<FormControl fullWidth>
							<InputLabel>Tên giáo viên</InputLabel>
							<Select
								value={selectedTeacher ?? ''}
								onChange={(e) => setSelectedTeacher(Number(e.target.value))}
								displayEmpty
								disabled={!dayjs().isAfter(dayjs(selectedDate))}
								variant='outlined'
								renderValue={(selected) =>
									teacherOptions.find((item) => item.value === selected)?.label ?? ''
								}
							>
								{teacherOptions.map((teacher) => (
									<MenuItem key={teacher.value} value={teacher.value}>
										{teacher.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>
				</div>
				{dayjs().isAfter(dayjs(selectedDate)) && (
					<div className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'>
						<ContainedButton
							title='Huỷ'
							onClick={handleClose}
							disableRipple
							styles='!bg-basic-gray-active !text-basic-gray !py-1 px-4'
						/>
						<ContainedButton
							title='cập nhật'
							disableRipple
							onClick={() => setIsConfirmModalOpen(true)}
							styles='bg-primary-400 text-white text-normal !py-1 px-4'
						/>
					</div>
				)}
				<PublishTimetableConfirmModal
					open={isConfirmModalOpen}
					setOpen={setIsConfirmModalOpen}
					handleApprove={handleApplyChanges}
				/>
			</Box>
		</Modal>
	);
};

export default PublishTimetableDetailsModal;

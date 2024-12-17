'use client';
import { ITimetableGenerationState, updateDataStored } from '@/context/slice_timetable_generation';
import {
	Box,
	Checkbox,
	FormControl,
	IconButton,
	InputLabel,
	ListItemText,
	MenuItem,
	Modal,
	Select,
	TextField,
	Typography,
} from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import ContainedButton from '@/commons/button-contained';
import { addDoc, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/utils/firebaseConfig';
import useNotify from '@/hooks/useNotify';
import { usePathname, useRouter } from 'next/navigation';
import { useAppContext } from '@/context/app_provider';
import useFetchSchoolYear from '@/hooks/useFetchSchoolYear';
import useFetchTerm from '@/hooks/useFetchTerm';
import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import {
	CONFIGURATION_FIRESTORE_NAME,
	GENERATED_SCHEDULE_FIRESTORE_NAME,
	IConfigurationStoreObject,
	IScheduleResponse,
	ISchoolYearResponse,
	ITermResponse,
	ITimetableStoreObject,
	TIMETABLE_FIRESTORE_NAME,
} from '@/utils/constants';
import Image from 'next/image';
import useFetchWeekDays from '../../_hooks/useFetchWeekdays';
import { IWeekdayResponse } from '../../_libs/constants';
import dayjs from 'dayjs';

const ITEM_HEIGHT = 30;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
			scrollbars: 'none',
		},
	},
};

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '40vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

interface ISortableDropdown<T> extends IDropdownOption<T> {
	criteria: string | number;
}

interface ITimetableDuplicationModalProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

const TimetableDuplicationModal = (props: ITimetableDuplicationModalProps) => {
	const { open, setOpen } = props;
	const { dataStored, timetableStored, generatedScheduleStored }: ITimetableGenerationState =
		useSelector((state: any) => state.timetableGeneration);
	const { selectedSchoolYearId, schoolId, sessionToken } = useAppContext();
	const router = useRouter();
	const pathName = usePathname();

	const [selectedYearId, setSelectedYearId] = useState<number>(0);
	const [selectedTermId, setSelectedTermId] = useState<number>(0);
	const [timetableName, setTimetableName] = useState<string>('');
	const [startWeek, setStartWeek] = useState<number>(1);
	const [endWeek, setEndWeek] = useState<number>(2);
	const [timetableAbbreviation, setTimetableAbbreviation] = useState<string>('');

	const [schoolYearIdOptions, setSchoolYearIdOptions] = useState<IDropdownOption<number>[]>([]);
	const [termIdOptions, setTermIdOptions] = useState<IDropdownOption<number>[]>([]);
	const [weekdayOptions, setWeekdayOptions] = useState<IDropdownOption<number>[]>([]);

	const { data: schoolYearData, mutate } = useFetchSchoolYear({ includePrivate: false });
	const { data: termData, mutate: updateTerm } = useFetchTerm({
		pageIndex: 1,
		pageSize: 100,
		schoolYearId: selectedSchoolYearId,
	});

	const { data: weekdayData, mutate: updateWeekdayData } = useFetchWeekDays({
		schoolId: Number(schoolId),
		sessionToken,
		termId: selectedTermId,
		yearId: selectedSchoolYearId,
	});

	useEffect(() => {
		updateTerm();
		if (termData?.status === 200) {
			setTermIdOptions([]);
			const tmpTermOptions: IDropdownOption<number>[] = termData.result.items.map(
				(term: ITermResponse) =>
					({
						label: `${term.name} | ${term['school-year-start']} - ${term['school-year-end']}`,
						value: term.id,
					} as IDropdownOption<number>)
			);
			if (tmpTermOptions.length > 0) {
				setTermIdOptions(tmpTermOptions.sort((a, b) => a.label.localeCompare(b.label)));
				setSelectedTermId(tmpTermOptions[0].value);
			}
		}
	}, [termData, selectedSchoolYearId, open]);

	useEffect(() => {
		updateWeekdayData();
		if (weekdayData?.status === 200) {
			setWeekdayOptions([]);
			const tmpWeekdayOptions: IDropdownOption<number>[] = weekdayData.result.map(
				(weekday: IWeekdayResponse) =>
					({
						label: `Tuần ${weekday['week-number']} (${dayjs(weekday['start-date']).format(
							'DD/MM/YYYY'
						)} - ${dayjs(weekday['end-date']).format('DD/MM/YYYY')})`,
						value: weekday['week-number'],
					} as IDropdownOption<number>)
			);
			if (tmpWeekdayOptions.length > 0) {
				setWeekdayOptions(tmpWeekdayOptions.sort((a, b) => a.value - b.value));
				setStartWeek(tmpWeekdayOptions[0].value);
				setEndWeek(tmpWeekdayOptions[tmpWeekdayOptions.length - 1].value);
			}
		}
	}, [weekdayData, selectedTermId, selectedSchoolYearId, open]);

	useEffect(() => {
		mutate();
		if (schoolYearData?.status === 200) {
			const options: IDropdownOption<number>[] = schoolYearData.result.map(
				(item: ISchoolYearResponse) => {
					const currentYear = new Date().getFullYear();
					if (
						parseInt(item['start-year']) <= currentYear &&
						parseInt(item['end-year']) >= currentYear
					) {
						setSelectedYearId(item.id);
					}
					return {
						label: `${item['start-year']} - ${item['end-year']}`,
						value: item.id,
					} as IDropdownOption<number>;
				}
			);
			setSchoolYearIdOptions(options.sort((a, b) => a.label.localeCompare(b.label)));
		}
	}, [schoolYearData, open]);

	const handleDuplicateTimetable = async () => {
		// Tạo timetable object lên Firebase
		let newTimetableData: ITimetableStoreObject = {
			...timetableStored,
			'timetable-name': timetableName,
			'timetable-abbreviation': timetableAbbreviation,
			'school-id': Number(schoolId),
			'year-id': selectedSchoolYearId,
			'year-name': schoolYearIdOptions.find((item) => item.value === selectedYearId)?.label ?? '',
			'term-name': termIdOptions.find((item) => item.value === selectedTermId)?.label ?? '',
			'term-id': selectedTermId,
			'applied-week': startWeek,
			'ended-week': endWeek,
			status: 'Draft',
		} as ITimetableStoreObject;

		let newConfigurationData: IConfigurationStoreObject = {
			...dataStored,
			id: '',
		} as IConfigurationStoreObject;

		let newGeneratedScheduleData: IScheduleResponse = {
			...generatedScheduleStored,
			'school-year-id': selectedSchoolYearId,
			'term-id': selectedTermId,
			'term-name': termIdOptions.find((item) => item.value === selectedTermId)?.label ?? '',
			'school-year-name':
				schoolYearIdOptions.find((item) => item.value === selectedYearId)?.label ?? '',
			'start-week': startWeek,
			'end-week': endWeek,
			'update-date': new Date().toISOString(),
		} as IScheduleResponse;

		const timetableRef = await addDoc(
			collection(firestore, TIMETABLE_FIRESTORE_NAME),
			newTimetableData
		);
		const configRef = await addDoc(
			collection(firestore, CONFIGURATION_FIRESTORE_NAME),
			newConfigurationData
		);
		const generatedScheduleRef = await addDoc(
			collection(firestore, GENERATED_SCHEDULE_FIRESTORE_NAME),
			newGeneratedScheduleData
		);

		if (timetableRef.id && configRef.id && generatedScheduleRef.id) {
			await updateDoc(timetableRef, {
				'config-id': configRef.id,
				'generated-schedule-id': generatedScheduleRef.id,
				'generated-date': new Date().toISOString(),
			});
			await updateDoc(configRef, { 'timetable-id': timetableRef.id });
			useNotify({
				type: 'success',
				message: 'Nhân bản thời khóa biểu thành công',
			});
			router.push(`/timetable-management/${timetableRef.id}`);
		}
	};

	const handleClose = () => {
		setOpen(false);
		setTimetableAbbreviation('');
		setTimetableName('');
		setSelectedYearId(0);
		setSelectedTermId(0);
		setStartWeek(1);
		setEndWeek(2);
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
					className='w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3 py-1'
				>
					<Typography
						variant='h6'
						component='h2'
						className='text-body-xlarge font-normal opacity-60'
					>
						Điều chỉnh thông tin thời khóa biểu
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='w-full h-fit flex flex-col justify-start items-center gap-2 p-3'>
					<TextField
						fullWidth
						variant='standard'
						id='abbreviation'
						name='abbreviation'
						label='Nhập mã Thời khóa biểu'
						value={timetableAbbreviation}
						onChange={(event) => setTimetableAbbreviation(event.target.value)}
						slotProps={{
							input: {
								endAdornment: (
									<Image
										className='opacity-30 mx-2 select-none'
										src='/images/icons/text-formatting.png'
										alt='email'
										width={20}
										height={20}
									/>
								),
							},
						}}
					/>
					<TextField
						fullWidth
						variant='standard'
						id='timetableName'
						name='timetableName'
						label='Nhập tên Thời khóa biểu'
						value={timetableName}
						onChange={(event) => setTimetableName(event.target.value)}
						slotProps={{
							input: {
								endAdornment: (
									<Image
										className='opacity-30 mx-2 select-none'
										src='/images/icons/text-formatting.png'
										alt='email'
										width={20}
										height={20}
									/>
								),
							},
						}}
					/>
					<FormControl sx={{ width: '100%' }}>
						<InputLabel id='school-year-label' variant='standard'>
							Chọn năm học
						</InputLabel>
						<Select
							labelId='school-year-label'
							id='school-year'
							variant='standard'
							value={selectedYearId}
							onChange={(event) => setSelectedYearId(Number(event.target.value))}
							MenuProps={MenuProps}
							renderValue={(selected) => {
								return schoolYearIdOptions.find((item) => item.value === selected)?.label ?? '';
							}}
							sx={{ width: '100%', fontSize: '1.000rem' }}
						>
							{schoolYearIdOptions?.length === 0 && (
								<MenuItem disabled value={0}>
									Không tìm thấy năm học
								</MenuItem>
							)}
							{schoolYearIdOptions.map((item, index) => (
								<MenuItem key={item.label + index} value={item.value}>
									<Checkbox
										checked={selectedYearId === 0 ? false : selectedYearId === item.value}
									/>
									<ListItemText primary={item.label} />
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl sx={{ width: '100%' }}>
						<InputLabel id='school-term-label' variant='standard'>
							Chọn học kỳ
						</InputLabel>
						<Select
							labelId='school-term-label'
							id='school-term'
							variant='standard'
							value={selectedTermId}
							onChange={(event) => setSelectedTermId(Number(event.target.value))}
							MenuProps={MenuProps}
							renderValue={(selected) => {
								return termIdOptions.find((item) => item.value === selected)?.label ?? '';
							}}
							sx={{ width: '100%', fontSize: '1.000rem' }}
						>
							{termIdOptions?.length === 0 && (
								<MenuItem disabled value={0}>
									Không tìm thấy năm học
								</MenuItem>
							)}
							{termIdOptions.map((item, index) => (
								<MenuItem key={item.label + index} value={item.value}>
									<Checkbox
										checked={selectedTermId === 0 ? false : selectedTermId === item.value}
									/>
									<ListItemText primary={item.label} />
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<div className='w-full h-fit flex flex-row justify-between items-center'>
						<FormControl sx={{ width: '45%' }}>
							<InputLabel id='school-year-label' variant='standard'>
								Tuần bắt đầu
							</InputLabel>
							<Select
								labelId='school-year-label'
								id='school-year'
								variant='standard'
								value={startWeek}
								onChange={(event) => setStartWeek(Number(event.target.value))}
								MenuProps={MenuProps}
								renderValue={(selected) => {
									return weekdayOptions.find((item) => item.value === selected)?.label ?? '';
								}}
								sx={{ width: '100%', fontSize: '1.000rem' }}
							>
								{weekdayOptions.map((option: IDropdownOption<number>, index: number) => (
									<MenuItem key={index} value={option.value}>
										<Checkbox checked={startWeek === 0 ? false : startWeek === option.value} />
										<ListItemText primary={option.label} />
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<FormControl sx={{ width: '45%' }}>
							<InputLabel id='school-year-label' variant='standard'>
								Tuần kết thúc
							</InputLabel>
							<Select
								labelId='school-year-label'
								id='school-year'
								variant='standard'
								value={endWeek}
								onChange={(event) => setEndWeek(Number(event.target.value))}
								MenuProps={MenuProps}
								renderValue={(selected) => {
									return weekdayOptions.find((item) => item.value === selected)?.label ?? '';
								}}
								sx={{ width: '100%', fontSize: '1.000rem' }}
							>
								{weekdayOptions.map((option: IDropdownOption<number>, index: number) => (
									<MenuItem key={index} value={option.value}>
										<Checkbox checked={startWeek === 0 ? false : startWeek === option.value} />
										<ListItemText primary={option.label} />
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
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
						title='nhân bản tkb'
						disableRipple
						type='button'
						styles='bg-primary-300 text-white !py-1 px-4'
						onClick={handleDuplicateTimetable}
					/>
				</div>
			</Box>
		</Modal>
	);
};

export default TimetableDuplicationModal;

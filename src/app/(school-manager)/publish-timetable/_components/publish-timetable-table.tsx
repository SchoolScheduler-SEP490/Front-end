import { useAppContext } from '@/context/app_provider';
import useFilterArray from '@/hooks/useFilterArray';
import {
	IClassCombinationScheduleObject,
	IClassPeriod,
	IClassSchedule,
	ITermResponse,
	WEEK_DAYS_FULL,
} from '@/utils/constants';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import {
	Button,
	FormControl,
	IconButton,
	MenuItem,
	Select,
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
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import useFetchWeekDays from '../_hooks/useFetchWeekdays';
import usePublishTimetableData from '../_hooks/usePublishTimetableData';
import { getTerms } from '../_libs/apiPublish';
import {
	IExtendedDropdownOption,
	IPeriodProcessData,
	ITimetableProcessData,
	IWeekdayResponse,
} from '../_libs/constants';
import PublishTimetableEditModal from './publish-timetable_modal_edit';
import PublishTimetableDetailsModal from './publish_timetable_modal_details';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.common.white,
		color: 'rgba(0, 0, 0, 0.87)',
		boxShadow: theme.shadows[1],
		fontSize: 14,
	},
}));

interface PublishTimetableTableProps {
	schoolId: string;
	schoolYearId: number;
	sessionToken: string;
}

const headerCellStyle = {
	border: '1px solid #e5e7eb',
	fontWeight: 'bold',
	textAlign: 'center',
	backgroundColor: '#f3f4f6',
};

const cellStyle = {
	border: '1px solid #e5e7eb',
	maxWidth: 10,
	textAlign: 'center',
	fontWeight: 'bold',
};

const ITEM_HEIGHT = 40;
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

export default function PublishTimetableTable({
	schoolId,
	schoolYearId,
	sessionToken,
}: PublishTimetableTableProps) {
	const [selectedTerm, setSelectedTerm] = useState<number>(1);
	const [terms, setTerms] = useState<ITermResponse[]>([]);
	const { selectedSchoolYearId } = useAppContext();
	const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
	const [selectedTeacher, setSelectedTeacher] = useState('all');
	const [selectedPeriod, setSelectedPeriod] = useState<IPeriodProcessData | null>(null);
	const router = useRouter();

	const [isTimetableEditModalOpen, openTimetableEditModal] = useState<boolean>(false);
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);

	const [weekdayOptions, setWeekdayOptions] = useState<IExtendedDropdownOption<string>[]>([]);
	const [processData, setProcessData] = useState<ITimetableProcessData[]>([]);
	const [existingCombination, setExistingCombination] = useState<IClassCombinationScheduleObject[]>(
		[]
	);

	const { data: weekdayData, mutate: updateWeekdayData } = useFetchWeekDays({
		schoolId: Number(schoolId),
		sessionToken,
		termId: selectedTerm,
		yearId: selectedSchoolYearId,
	});
	const {
		data: scheduleData,
		isValidating,
		mutate,
	} = usePublishTimetableData({
		schoolId,
		schoolYearId,
		termId: selectedTerm,
		sessionToken,
		date: selectedDate.toDate(),
	});

	useEffect(() => {
		updateWeekdayData();
		if (weekdayData?.status === 200) {
			setWeekdayOptions([]);
			const tmpWeekdayOptions: IExtendedDropdownOption<string>[] = weekdayData.result.map(
				(weekday: IWeekdayResponse) =>
					({
						label: `Tuần ${weekday['week-number']} (${dayjs(weekday['start-date']).format(
							'DD/MM/YYYY'
						)} - ${dayjs(weekday['end-date']).format('DD/MM/YYYY')})`,
						value: `${weekday['start-date']}`,
						extra: weekday['week-number'],
						max: weekday['end-date'],
					} as IExtendedDropdownOption<string>)
			);
			if (tmpWeekdayOptions.length > 0) {
				setWeekdayOptions(
					tmpWeekdayOptions.filter((option) => dayjs(option.value).add(1, 'week').isAfter(dayjs()))
				);
			}
		}
	}, [weekdayData]);

	useEffect(() => {
		mutate();
		setProcessData([]);
		if (scheduleData?.status === 200) {
			const tmpProcessData: ITimetableProcessData[] = scheduleData.result['class-schedules'].map(
				(classSchedule: IClassSchedule) =>
					({
						classId: classSchedule['student-class-id'],
						className: classSchedule['student-class-name'],
						mainSessionId: 0,
						periods: classSchedule['class-periods'].map(
							(period: IClassPeriod) =>
								({
									periodId: period.id,
									slot: period['start-at'],
									subjectId: period['subject-id'],
									subjectAbbreviation: period['subject-abbreviation'],
									teacherId: period['teacher-id'],
									classId: classSchedule['student-class-id'],
									className: classSchedule['student-class-name'],
									teacherName: period['teacher-abbreviation'],
									roomId: period['room-id'],
									roomName: period['room-code'],
									priority: period.priority,
								} as IPeriodProcessData)
						),
					} as ITimetableProcessData)
			);
			if (tmpProcessData.length > 0) {
				setProcessData(tmpProcessData);
				setExistingCombination(scheduleData.result['class-combinations']);
			} else {
				setProcessData([]);
			}
		}
	}, [scheduleData, selectedDate]);

	useEffect(() => {
		const fetchTerm = async () => {
			try {
				const response = await getTerms(sessionToken, selectedSchoolYearId);
				if (response.status === 200) {
					setTerms(
						response.result.items.sort((a: ITermResponse, b: ITermResponse) =>
							a.name.localeCompare(b.name)
						)
					);
				}
			} catch (error) {
				console.error('Failed to fetch term name:', error);
			}
		};
		fetchTerm();
	}, [selectedSchoolYearId]);

	const handleEditTimetable = () => {
		openTimetableEditModal(true);
	};

	const filteredData = useMemo(() => {
		const tmpDisplayData = useFilterArray(processData, ['classId']).sort((a, b) =>
			a.className.localeCompare(b.className)
		);
		// Bước 1: Sort theo độ dài chuỗi
		tmpDisplayData.sort((a, b) => a.className.length - b.className.length);

		// Bước 2: Sort theo thứ tự alphabet nếu độ dài bằng nhau
		tmpDisplayData.sort((a, b) => {
			if (a.className.length === b.className.length) {
				return a.className.localeCompare(b.className, undefined, {
					numeric: true,
				});
			}
			return 0; // Không thay đổi nếu độ dài khác nhau (đã được xử lý ở bước 1)
		});
		return tmpDisplayData;
	}, [processData, selectedTeacher]);

	const teacherNames = useMemo(() => {
		if (!scheduleData) return [];
		const teachers = new Set<string>();

		if (scheduleData?.status === 200) {
			scheduleData.result['class-schedules'].forEach((schedule: IClassSchedule) => {
				schedule['class-periods'].forEach((period: IClassPeriod) => {
					teachers.add(period['teacher-abbreviation']);
				});
			});
		}

		return Array.from(teachers) as string[];
	}, [scheduleData]);

	const handleSelectPeriod = (period: IPeriodProcessData) => {
		setSelectedPeriod(period);
		setIsDetailsModalOpen(true);
	};

	return (
		<div className='w-full h-full flex flex-col justify-between gap-4'>
			<div className='w-full flex justify-between items-center gap-4'>
				<div className='flex gap-4 px-[2vw]'>
					<FormControl sx={{ minWidth: 170 }}>
						<Select
							value={selectedTerm}
							onChange={(e) => setSelectedTerm(Number(e.target.value))}
							variant='standard'
						>
							{terms.map((term) => (
								<MenuItem key={term.id} value={term.id}>
									{term.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<DatePicker
						value={selectedDate}
						onChange={(newValue) => setSelectedDate(newValue || dayjs())}
						format='DD/MM/YYYY'
						slotProps={{ textField: { variant: 'standard' } }}
					/>

					<FormControl sx={{ minWidth: 170 }}>
						<Select
							value={selectedTeacher}
							onChange={(e) => setSelectedTeacher(e.target.value)}
							variant='standard'
							MenuProps={MenuProps}
						>
							<MenuItem value='all'>Tất cả giáo viên</MenuItem>
							{teacherNames.map((teacher) => (
								<MenuItem key={teacher} value={teacher}>
									{teacher}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
				<div className='flex flex-row justify-end items-center pr-[2vw]'>
					<LightTooltip title='Chỉnh sửa TKB' arrow>
						<IconButton
							color='primary'
							onClick={handleEditTimetable}
							disabled={(!scheduleData && !isValidating) || isValidating}
						>
							<DriveFileRenameOutlineIcon />
						</IconButton>
					</LightTooltip>
				</div>
			</div>

			{!scheduleData && !isValidating ? (
				<div className='flex flex-col justify-center items-center w-full h-full gap-8 p-12'>
					<div className='flex justify-center transform transition-all duration-500 hover:scale-110'>
						<Image
							src='/images/icons/empty-folder.png'
							alt='No schedule available'
							width={250}
							height={200}
							unoptimized={true}
							className='opacity-90 drop-shadow-lg'
						/>
					</div>

					<div className='text-center space-y-2'>
						<Typography variant='h5' className='text-gray-700 font-semibold tracking-wide'>
							Thời khóa biểu chưa có dữ liệu!
						</Typography>
						<Typography variant='body1' className='text-gray-500'>
							Bấm nút bên dưới để bắt đầu tạo thời khóa biểu mới
						</Typography>
					</div>

					<Button
						variant='contained'
						size='medium'
						className='!bg-primary-500 !hover:bg-primary-600 text-white px-8 py-3 rounded-s 
               transform transition-all duration-300 hover:scale-105 hover:shadow-lg
               flex items-center gap-2'
						onClick={() => router.push(`/timetable-generation`)}
					>
						Tạo thời khóa biểu
					</Button>
				</div>
			) : (
				<div className='w-full h-[90vh] flex flex-col justify-start items-center pb-[2vh]'>
					<TableContainer sx={{ mb: 10, maxHeight: '100%' }} className='!no-scrollbar'>
						<Table size='small' stickyHeader sx={{ position: 'relative' }}>
							<TableHead
								sx={{
									position: 'sticky',
									top: 0,
									left: 0,
									zIndex: 100,
								}}
							>
								<TableRow>
									<TableCell sx={headerCellStyle}>Thứ</TableCell>
									<TableCell sx={headerCellStyle}>Tiết</TableCell>
									{filteredData &&
										filteredData?.map((clazz: ITimetableProcessData) => (
											<TableCell
												sx={{
													border: '1px solid #ddd',
													fontWeight: 'bold',
													textAlign: 'center',
													backgroundColor: '#f5ffff',
												}}
											>
												{clazz.className}
											</TableCell>
										))}
								</TableRow>
							</TableHead>

							<TableBody>
								{WEEK_DAYS_FULL.map((weekday: string, weekdayIndex: number) => (
									<>
										{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((slot: number, slotIndex: number) => (
											<TableRow>
												{slotIndex === 0 && (
													<TableCell
														sx={{
															border: '1px solid #ddd',
															minWidth: 10,
															width: 10,
															maxWidth: 10,
															textAlign: 'center',
															fontWeight: 'bold',
															overflow: 'hidden',
														}}
														rowSpan={10}
														width={10}
													>
														{weekday}
													</TableCell>
												)}
												<TableCell
													sx={{
														border: '1px solid #ddd',
														maxWidth: 10,
														textAlign: 'center',
														fontWeight: 'bold',
													}}
													className={`${
														slotIndex < 5 ? '!text-primary-400' : '!text-tertiary-normal'
													}`}
												>
													{slot}
												</TableCell>
												{filteredData &&
													filteredData.map((clazz: ITimetableProcessData) => {
														const period =
															selectedTeacher === 'all'
																? clazz.periods.find(
																		(item) => item.slot === slot + weekdayIndex * 10
																  )
																: clazz.periods
																		.filter((item) => item.teacherName === selectedTeacher)
																		.find((item) => item.slot === slot + weekdayIndex * 10);
														const isCombination =
															existingCombination?.length > 0 &&
															existingCombination.some(
																(combination) =>
																	combination.classes.some(
																		(clazz) => clazz.id === period?.classId
																	) && combination['start-at'].includes(period?.slot ?? 0)
																// combination['teacher-id'] === period?.teacherId
															);
														if (period) {
															return (
																<TableCell
																	sx={{
																		border: '1px solid #ddd',
																		maxWidth: 150,
																		maxHeight: 100,
																		backgroundColor: '#f5f5f5',
																		overflow: 'hidden',
																		m: 0,
																		p: 0,
																	}}
																>
																	{!isCombination ? (
																		<div
																			className='flex flex-col justify-center items-center h-full p-1 gap-1 relative cursor-pointer'
																			onClick={() => handleSelectPeriod(period)}
																		>
																			<strong className='tracking-wider text-ellipsis text-nowrap overflow-hidden text-primary-500 text-sm font-semibold'>
																				{period.subjectAbbreviation}
																			</strong>
																			<div className='flex justify-center gap-2 mt-1'>
																				<p className='text-ellipsis text-nowrap overflow-hidden text-gray-600 text-xs'>
																					{period.roomName}
																				</p>
																				<p className='text-ellipsis text-nowrap overflow-hidden text-gray-600 text-xs'>
																					{period.teacherName}
																				</p>
																			</div>
																		</div>
																	) : (
																		<LightTooltip title='Tiết học lớp gộp'>
																			<div className='relative flex flex-col justify-center items-center opacity-80 overflow-hidden px-1'>
																				<strong className='tracking-widertext-ellipsis text-nowrap overflow-hidden text-primary-400'>
																					{period.subjectAbbreviation}
																				</strong>
																				<p className='text-ellipsis text-nowrap overflow-hidden '>
																					{period.teacherName}
																				</p>
																				<div className='absolute top-0 right-0 -translate-y-[50%] translate-x-[10%] bg-tertiary-normal w-[20%] h-[130%] flex flex-row justify-center items-center -rotate-[50deg]'></div>
																			</div>
																		</LightTooltip>
																	)}
																</TableCell>
															);
														}
														return (
															<TableCell
																sx={{
																	border: '1px solid #ddd',
																	width: 50,
																}}
															></TableCell>
														);
													})}
											</TableRow>
										))}
										<TableRow key={weekdayIndex + Math.floor(Math.random() * 1000)}>
											<TableCell
												sx={{
													width: '100%',
													height: 1,
												}}
												colSpan={filteredData?.length + 2}
											></TableCell>
										</TableRow>
									</>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<PublishTimetableEditModal
						open={isTimetableEditModalOpen}
						setOpen={openTimetableEditModal}
						data={processData}
						weekdayOptions={weekdayOptions}
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
						updateData={mutate}
					/>
					<PublishTimetableDetailsModal
						open={isDetailsModalOpen}
						setOpen={setIsDetailsModalOpen}
						selectedDate={selectedDate.toISOString()}
						selectedSlot={selectedPeriod}
						selectedTermId={selectedTerm}
						updateData={mutate}
						weekdayOptions={weekdayOptions}
					/>
				</div>
			)}
		</div>
	);
}

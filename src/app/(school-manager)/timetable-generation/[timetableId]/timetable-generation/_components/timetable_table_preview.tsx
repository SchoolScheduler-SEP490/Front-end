import { useAppContext } from '@/context/app_provider';
import { ITimetableGenerationState } from '@/context/slice_timetable_generation';
import useFilterArray from '@/hooks/useFilterArray';
import { useSMSelector } from '@/hooks/useReduxStore';
import {
	IClassCombinationScheduleObject,
	IClassPeriod,
	IClassSchedule,
	IFixedPeriodObject,
	ITeachingAssignmentObject,
	WEEK_DAYS,
} from '@/utils/constants';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import {
	Box,
	Button,
	CircularProgress,
	circularProgressClasses,
	Collapse,
	IconButton,
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
} from '@mui/material';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import useFetchClassData from '../_hooks/useFetchClass';
import useFetchSubject from '../_hooks/useFetchSubject';
import useFetchTeacher from '../_hooks/useFetchTeacher';
import { getFetchTeachingAssignmentApi } from '../_libs/apis';
import {
	IAssignmentResponse,
	IClassResponse,
	IPeriodDisplayData,
	ISubjectResponse,
	ITeacherResponse,
	ITimetableDisplayData,
} from '../_libs/constants';
import ConfigurationAdjustModal from './timetable_modal_adjust';
import TimetableConfirmModal from './timetable_modal_confirm';
import TimetableEditModal from './timetable_modal_edit';

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

interface IPreviewScheduleProps {
	isTimetableGenerating: boolean;
	handleGenerateTimetable: () => void;
}

const PreviewScheduleTable = (props: IPreviewScheduleProps) => {
	const { handleGenerateTimetable, isTimetableGenerating } = props;
	const { selectedSchoolYearId, schoolId, sessionToken } = useAppContext();
	const { dataStored, timetableStored, generatedScheduleStored }: ITimetableGenerationState =
		useSMSelector((state) => state.timetableGeneration);

	const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
	const [isConfigurationOpen, openConfiguration] = useState<boolean>(false);
	const [isTimetableGenerated, setIsTimetableGenerated] = useState<boolean>(false);
	const [isTimetableEditModalOpen, openTimetableEditModal] = useState<boolean>(false);
	const [isConfirmModalOpen, openConfirmModal] = useState<boolean>(false);
	const [existingCombination, setExistingCombination] = useState<IClassCombinationScheduleObject[]>(
		[]
	);

	const [displayData, setDisplayData] = useState<ITimetableDisplayData[]>([]);

	const { data: teacherData, mutate: updateTeacher } = useFetchTeacher({
		sessionToken,
		schoolId,
		pageSize: 1000,
		pageIndex: 1,
	});

	const { data: classData, mutate: updateClass } = useFetchClassData({
		sessionToken,
		schoolId,
		pageSize: 1000,
		pageIndex: 1,
		schoolYearId: selectedSchoolYearId,
	});

	const { data: subjectData, mutate: updateSubject } = useFetchSubject({
		sessionToken,
		schoolYearId: selectedSchoolYearId,
		pageSize: 100,
		pageIndex: 1,
	});

	useEffect(() => {
		updateTeacher();
		updateClass();
		updateSubject();
		setDisplayData([]);
		if (
			teacherData?.status === 200 &&
			classData?.status === 200 &&
			subjectData?.status === 200 &&
			dataStored &&
			timetableStored
		) {
			setIsDataLoading(true);
			if (generatedScheduleStored && generatedScheduleStored.id) {
				// Nếu đã có thời khóa biểu được tạo ra
				openConfiguration(false);
				setIsTimetableGenerated(true);
				const tmpDisplayData: ITimetableDisplayData[] = generatedScheduleStored[
					'class-schedules'
				].map((clazz: IClassSchedule) => {
					const existingClass: IClassResponse | undefined = classData.result.items.find(
						(item: IClassResponse) => item.id === clazz['student-class-id']
					);
					return {
						classId: clazz['student-class-id'],
						className: clazz['student-class-name'],
						mainSessionId: existingClass ? existingClass['main-session'] - 1 : 0,
						periods: clazz['class-periods'].map(
							(period: IClassPeriod) =>
								({
									slot: period['start-at'],
									subjectId: period['subject-id'],
									subjectAbbreviation: period['subject-abbreviation'],
									teacherId: period['teacher-id'],
									classId: clazz['student-class-id'],
									className: clazz['student-class-name'],
									teacherName: period['teacher-abbreviation'],
									roomId: period['room-id'],
									roomName: period['room-code'],
									priority: period.priority,
								} as IPeriodDisplayData)
						),
					} as ITimetableDisplayData;
				});
				if (tmpDisplayData.length > 0) {
					setDisplayData(tmpDisplayData);
					setIsDataLoading(false);
				}
				if (generatedScheduleStored['class-combinations'].length > 0) {
					setExistingCombination(generatedScheduleStored['class-combinations']);
				}
			} else {
				// Nếu chưa có thời khóa biểu được tạo ra
				openConfiguration(true);
				setIsTimetableGenerated(false);
				classData.result.items.map(async (clazz: IClassResponse) => {
					const assignmentEndpoint = getFetchTeachingAssignmentApi({
						schoolId: Number(schoolId),
						schoolYearId: selectedSchoolYearId,
						studentClassId: clazz.id,
						termId: timetableStored['term-id'],
					});
					const response = await fetch(assignmentEndpoint, {
						method: 'GET',
						headers: {
							Authorization: `Bearer ${sessionToken}`,
						},
					});
					if (response.ok) {
						const data = await response.json();
						// Trong này có lớp học và môn học
						const availableAssignments: IAssignmentResponse[] = [
							...data.result['teacher-assignt-view'],
							...data.result['teacher-not-assignt-view'],
						];
						const tmpPeriods: IPeriodDisplayData[] = [];
						availableAssignments.forEach((assignment: IAssignmentResponse) => {
							const assignedTeacher: ITeachingAssignmentObject | undefined = dataStored[
								'teacher-assignments'
							].find((item) => item['assignment-id'] === assignment.id);

							const availableTeacher: ITeacherResponse | undefined = teacherData.result.items.find(
								(teacher: ITeacherResponse) => teacher.id === assignedTeacher?.['teacher-id']
							);

							if (availableTeacher) {
								// Assign giá trị vào trong class
								dataStored['fixed-periods-para'].forEach((slot: IFixedPeriodObject) => {
									if (
										slot['class-id'] === assignment['student-class-id'] &&
										slot['subject-id'] === assignment['subject-id']
									) {
										const existingSubject: ISubjectResponse = subjectData.result.items.find(
											(subject: ISubjectResponse) => subject.id === assignment['subject-id']
										);
										if (existingSubject) {
											tmpPeriods.push({
												slot: slot['start-at'],
												subjectId: assignment['subject-id'],
												subjectAbbreviation: existingSubject.abbreviation,
												teacherId: availableTeacher.id,
												teacherName: availableTeacher.abbreviation,
											} as IPeriodDisplayData);
										}
									}
								});
							}
						});
						setDisplayData((prev) => [
							...prev,
							{
								classId: clazz.id,
								className: clazz.name,
								periods: tmpPeriods,
							} as ITimetableDisplayData,
						]);
					}
				});
				setIsDataLoading(false);
			}
		}
	}, [classData, teacherData, subjectData, dataStored, timetableStored, generatedScheduleStored]);

	const handleConfigurationButton = () => {
		openConfiguration(true);
	};

	const handleEditTimetable = () => {
		openTimetableEditModal(true);
	};

	const handleConfirmRegenerateTimetable = () => {
		openConfirmModal(false);
		handleGenerateTimetable();
	};

	const filteredData = useMemo(() => {
		const tmpDisplayData = useFilterArray(displayData, ['classId']).sort((a, b) =>
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
	}, [displayData]);

	return (
		<div className='w-full h-[100vh] flex flex-col justify-between py-2 items-center'>
			<Collapse
				in={!isTimetableGenerating}
				orientation='vertical'
				timeout={300}
				unmountOnExit
				sx={{
					height: '10vh',
					position: 'relative',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
				}}
			>
				{timetableStored['generated-schedule-id'] ? (
					<div className='w-full h-full flex flex-row justify-center items-center gap-5 py-2 translate-x-[0.5%]'>
						<h1 className='text-title-small-strong opacity-60 h-full align-middle'>
							{generatedScheduleStored.name}
						</h1>
						<div className='w-fit h-full flex flex-row justify-start items-center gap-2'>
							<Image src={'/images/icons/dumbbell.png'} alt='dumbbell' width={15} height={15} />
							<h1
								className={`text-body-large-strong font-semibold ${
									generatedScheduleStored['fitness-point'] > 80
										? 'text-basic-positive'
										: 'text-basic-gray'
								}`}
							>
								{generatedScheduleStored['fitness-point']}%
							</h1>
						</div>
					</div>
				) : (
					<h1 className='py-2 text-title-small-strong opacity-60 w-full text-center'>
						Các tiết xếp sẵn
					</h1>
				)}
				{!isTimetableGenerated ? (
					<div className='w-fit h-full flex flex-row justify-between items-center gap-5 absolute top-[0%] right-[2%] z-10'>
						<Button
							variant='contained'
							onClick={handleGenerateTimetable}
							color='inherit'
							disabled={isDataLoading}
							sx={{
								bgcolor: '#175b8e',
								color: 'white',
								borderRadius: 0,
								boxShadow: 'none',
							}}
						>
							Tạo thời khóa biểu
						</Button>

						<LightTooltip title='Cấu hình TKB' arrow>
							<IconButton color='primary' onClick={handleConfigurationButton}>
								<Image src={'/images/icons/setting.png'} alt='Cấu hình' width={20} height={20} />
							</IconButton>
						</LightTooltip>
					</div>
				) : (
					<div className='w-fit h-full flex flex-row justify-between items-center gap-2 absolute top-[0%] right-[2%] z-10'>
						<LightTooltip title='Chỉnh sửa TKB' arrow>
							<IconButton color='primary' onClick={handleEditTimetable}>
								<DriveFileRenameOutlineIcon />
							</IconButton>
						</LightTooltip>

						<LightTooltip title='Xếp lại TKB' arrow>
							<IconButton color='success' onClick={() => openConfirmModal(true)}>
								<EventRepeatIcon />
							</IconButton>
						</LightTooltip>

						<LightTooltip title='Cấu hình TKB' arrow>
							<IconButton color='primary' onClick={handleConfigurationButton}>
								<Image src={'/images/icons/setting.png'} alt='Cấu hình' width={20} height={20} />
							</IconButton>
						</LightTooltip>
					</div>
				)}
			</Collapse>
			{isDataLoading ? (
				// Loading component
				<div className='w-full h-[80%] p-3 flex justify-center items-start overflow-y-scroll no-scrollbar'>
					<Box sx={{ position: 'relative' }}>
						<CircularProgress
							variant='determinate'
							sx={(theme) => ({
								color: theme.palette.grey[200],
								...theme.applyStyles('dark', {
									color: theme.palette.grey[800],
								}),
							})}
							size={40}
							thickness={4}
							{...props}
							value={100}
						/>
						<CircularProgress
							variant='indeterminate'
							disableShrink
							sx={(theme) => ({
								color: '#004e89',
								animationDuration: '550ms',
								position: 'absolute',
								left: 0,
								[`& .${circularProgressClasses.circle}`]: {
									strokeLinecap: 'round',
								},
								...theme.applyStyles('dark', {
									color: '#308fe8',
								}),
							})}
							size={40}
							thickness={4}
							{...props}
						/>
					</Box>
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
									<TableCell
										sx={{
											border: '1px solid #ddd',
											fontWeight: 'bold',
											textAlign: 'center',
											backgroundColor: '#f5ffff',
										}}
									>
										Thứ
									</TableCell>
									<TableCell
										sx={{
											border: '1px solid #ddd',
											fontWeight: 'bold',
											textAlign: 'center',
											backgroundColor: '#f5ffff',
										}}
									>
										Tiết
									</TableCell>
									{filteredData &&
										filteredData?.map((clazz: ITimetableDisplayData) => (
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
								{WEEK_DAYS.map((weekday: string, weekdayIndex: number) => (
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
													filteredData.map((clazz: ITimetableDisplayData) => {
														const period = clazz.periods.find(
															(item) => item.slot === slot + weekdayIndex * 10
														);
														const isCombination =
															existingCombination.length > 0 &&
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
																		maxWidth: 50,
																		maxHeight: 100,
																		backgroundColor: '#f5f5f5',
																		overflow: 'hidden',
																		m: 0,
																		p: 0,
																	}}
																>
																	{!isCombination ? (
																		<div className='flex flex-col justify-center items-center opacity-80 '>
																			<strong className='tracking-widertext-ellipsis text-nowrap overflow-hidden text-primary-400'>
																				{period.subjectAbbreviation}
																			</strong>
																			<p className='text-ellipsis text-nowrap overflow-hidden'>
																				{period.teacherName}
																			</p>
																		</div>
																	) : (
																		<LightTooltip title='Tiết học lớp gộp'>
																			<div className='relative flex flex-col justify-center items-center opacity-80 overflow-hidden'>
																				<strong className='tracking-widertext-ellipsis text-nowrap overflow-hidden text-primary-400'>
																					{period.subjectAbbreviation}
																				</strong>
																				<p className='text-ellipsis text-nowrap overflow-hidden'>
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
				</div>
			)}
			<ConfigurationAdjustModal open={isConfigurationOpen} setOpen={openConfiguration} />
			<TimetableEditModal
				open={isTimetableEditModalOpen}
				setOpen={openTimetableEditModal}
				data={displayData}
			/>
			<TimetableConfirmModal
				open={isConfirmModalOpen}
				setOpen={openConfirmModal}
				handleConfirm={handleConfirmRegenerateTimetable}
				message='Xếp lại toàn bộ TKB với những tham số đã tạo?'
			/>
		</div>
	);
};

export default PreviewScheduleTable;

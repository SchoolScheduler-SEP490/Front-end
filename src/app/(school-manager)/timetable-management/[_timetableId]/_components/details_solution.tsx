import { IScheduleResponse, TIMETABLE_SLOTS, WEEK_DAYS_FULL } from '@/utils/constants';
import TuneIcon from '@mui/icons-material/Tune';
import {
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

interface IDetailsSolutionProps {
	selectedTeacher: string;
	setSelectedTeacher: Dispatch<SetStateAction<string>>;
	teacherNames: string[];
	timetableId: string;
	scheduleData: IScheduleResponse | null;
}

const DetailsSolution: React.FC<IDetailsSolutionProps> = (props) => {
	const { selectedTeacher, setSelectedTeacher, teacherNames, timetableId, scheduleData } = props;
	const router = useRouter();

	return (
		<div className='w-full h-fit flex flex-col justify-center items-center px-[2vw] pt-[3vh]'>
			<div className='w-full mb-4 flex justify-between items-center'>
				<FormControl sx={{ minWidth: 170 }}>
					<InputLabel>Giáo viên</InputLabel>
					<Select
						value={selectedTeacher}
						label='Giáo viên'
						onChange={(e) => setSelectedTeacher(e.target.value)}
						MenuProps={{
							PaperProps: {
								style: {
									maxHeight: 200,
									width: 250,
								},
							},
						}}
					>
						<MenuItem value='all'>Tất cả</MenuItem>
						{teacherNames.map((teacher) => (
							<MenuItem key={teacher} value={teacher}>
								{teacher}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<Tooltip title='Cấu hình'>
					<IconButton
						onClick={() => router.push(`/timetable-generation/${timetableId}/information`)}
					>
						<TuneIcon />
					</IconButton>
				</Tooltip>
			</div>

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
										border: '1px solid #e5e7eb',
										fontWeight: 'bold',
										textAlign: 'center',
										backgroundColor: '#f3f4f6',
									}}
								>
									Thứ
								</TableCell>
								<TableCell
									sx={{
										border: '1px solid #e5e7eb',
										fontWeight: 'bold',
										textAlign: 'center',
										backgroundColor: '#f3f4f6',
									}}
								>
									Tiết
								</TableCell>
								{scheduleData?.['class-schedules'].map((classSchedule) => (
									<TableCell
										key={classSchedule['student-class-id']}
										sx={{
											border: '1px solid #e5e7eb',
											fontWeight: 'bold',
											textAlign: 'center',
											backgroundColor: '#f3f4f6',
										}}
									>
										{classSchedule['student-class-name']}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{WEEK_DAYS_FULL.map((day, dayIndex) => (
								<>
									{TIMETABLE_SLOTS.map((session, sessionIndex) =>
										session.slots.map((slot, slotIndex) => (
											<TableRow key={`${day}-${session.period}-${slotIndex}`}>
												{slotIndex === 0 && sessionIndex === 0 && (
													<TableCell
														rowSpan={TIMETABLE_SLOTS.reduce((acc, s) => acc + s.slots.length, 0)}
														sx={{
															border: '1px solid #e5e7eb',
															minWidth: 10,
															width: 10,
															maxWidth: 10,
															textAlign: 'center',
															fontWeight: 'bold',
															overflow: 'hidden',
														}}
													>
														{day}
													</TableCell>
												)}
												<TableCell
													sx={{
														border: '1px solid #e5e7eb',
														maxWidth: 10,
														textAlign: 'center',
														fontWeight: 'bold',
													}}
													className={`${
														sessionIndex < 2 ? '!text-primary-400' : '!text-tertiary-normal'
													}`}
												>
													{sessionIndex * 5 + slotIndex + 1}
												</TableCell>

												{scheduleData?.['class-schedules'].map((classSchedule) => {
													const currentSlotIndex = dayIndex * 10 + sessionIndex * 5 + slotIndex + 1;
													const period = classSchedule['class-periods'].find(
														(p) =>
															p['start-at'] === currentSlotIndex &&
															!p['is-deleted'] &&
															(selectedTeacher === 'all' ||
																p['teacher-abbreviation'] === selectedTeacher)
													);

													return (
														<TableCell
															key={`${classSchedule['student-class-id']}-${currentSlotIndex}`}
															sx={{
																border: '1px solid #e5e7eb',
																maxWidth: 110,
																height: '70px',
																backgroundColor: period ? '#f8faff' : 'white',
																overflow: 'hidden',
																cursor: 'pointer',
																transition: 'all 0.2s ease-in-out',
																'&:hover': {
																	backgroundColor: period ? '#e5e7eb' : '#e5e7eb',
																	boxShadow: 'inset 0 0 0 1px #fafafa',
																},
															}}
														>
															{period && (
																<div className='flex flex-col justify-center items-center h-full p-1 gap-1'>
																	<strong className='tracking-wider text-ellipsis text-nowrap overflow-hidden text-primary-500 text-sm font-semibold'>
																		{period['subject-abbreviation']}
																	</strong>
																	<div className='flex justify-between gap-3'>
																		<p className='text-ellipsis text-nowrap overflow-hidden text-gray-600 text-xs'>
																			{period['room-code']}
																		</p>
																		<p className='text-ellipsis text-nowrap overflow-hidden text-gray-600 text-xs'>
																			{period['teacher-abbreviation']}
																		</p>
																	</div>
																</div>
															)}
														</TableCell>
													);
												})}
											</TableRow>
										))
									)}
								</>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</div>
	);
};

export default DetailsSolution;

'use client';

import { ITimetableGenerationState } from '@/context/slice_timetable_generation';
import { useSMSelector } from '@/hooks/useReduxStore';
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
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import ExportDialog from './details_configurations/export_timetable';
import useFetchData from '@/app/(admin)/subjects/_hooks/useFetchData';
import { useAppContext } from '@/context/app_provider';
import { ISubjectResponse } from '@/app/(school-manager)/department-management/_libs/constants';
import { ITeacherResponse } from '../_libs/constants';

interface IDetailsSolutionProps {
	selectedTeacher: string;
	setSelectedTeacher: Dispatch<SetStateAction<string>>;
	teacherNames: string[];
	timetableId: string;
	scheduleData: IScheduleResponse | null;
}

const DetailsSolution: React.FC<IDetailsSolutionProps> = (props) => {
	const { selectedTeacher, setSelectedTeacher, teacherNames, timetableId, scheduleData } = props;
	const { timetableStored }: ITimetableGenerationState = useSMSelector(
		(state) => state.timetableGeneration
	);

	const router = useRouter();
	const [openExportModel, setOpenExportModel] = useState(false);
	const { selectedSchoolYearId, sessionToken } = useAppContext();
	const [subjectLoadedData, setsubjectLoadedData] = useState<ISubjectResponse[]>([]);
	const [teacherLoadedData, setteacherLoadedData] = useState<ITeacherResponse[]>([]);
	const { data: subjectData } = useFetchData({
		sessionToken: sessionToken,
		schoolYearId: selectedSchoolYearId,
		pageSize: 100,
		pageIndex: 1,
	});
	const { data: teacherData } = useFetchData({
		sessionToken: sessionToken,
		schoolYearId: selectedSchoolYearId,
		pageSize: 200,
		pageIndex: 1,
	});

	useEffect(() => {
		if (subjectData?.status === 200) {
			setsubjectLoadedData(subjectData.result.items);
		}
	}, [subjectData, selectedSchoolYearId]);

	useEffect(() => {
		if (teacherData?.status === 200) {
			setteacherLoadedData(teacherData.result.items);
		}
	}, [teacherData, selectedSchoolYearId]);

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
				<div className='flex items-center gap-3'>
					<Tooltip title='Xuất TKB'>
						<IconButton
							onClick={() => setOpenExportModel(true)}
							disabled={subjectLoadedData.length == 0 || teacherLoadedData.length == 0}
						>
							<DownloadIcon />
						</IconButton>
					</Tooltip>
					{timetableStored &&
						['Published', 'PublishedInternal'].includes(timetableStored.status) && (
							<Tooltip title='Cấu hình'>
								<IconButton
									onClick={() => router.push(`/timetable-generation/${timetableId}/information`)}
								>
									<TuneIcon />
								</IconButton>
							</Tooltip>
						)}
				</div>
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

				<ExportDialog
					open={openExportModel}
					onClose={() => setOpenExportModel(false)}
					scheduleData={scheduleData}
					subjectData={subjectLoadedData}
					teacherData={teacherLoadedData}
				/>
			</div>
		</div>
	);
};

export default DetailsSolution;

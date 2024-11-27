import { useAppContext } from '@/context/app_provider';
import { ITimetableGenerationState } from '@/context/slice_timetable_generation';
import useFilterArray from '@/hooks/useFilterArray';
import {
	IClassPeriod,
	IClassSchedule,
	IFixedPeriodObject,
	ITeachingAssignmentObject,
	WEEK_DAYS,
} from '@/utils/constants';
import {
	Box,
	CircularProgress,
	circularProgressClasses,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
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
import Image from 'next/image';

interface IPreviewScheduleProps {
	// Add props herer
}

const PreviewScheduleTable = (props: IPreviewScheduleProps) => {
	// Add logic here
	const {} = props;
	const { selectedSchoolYearId, schoolId, sessionToken } = useAppContext();
	const { dataStored, timetableStored, generatedScheduleStored }: ITimetableGenerationState =
		useSelector((state: any) => state.timetableGeneration);

	const [displayData, setDisplayData] = useState<ITimetableDisplayData[]>([]);
	const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

	const {
		data: teacherData,
		mutate: updateTeacher,
		isValidating: isTeacherValidating,
	} = useFetchTeacher({
		sessionToken,
		schoolId,
		pageSize: 1000,
		pageIndex: 1,
	});

	const {
		data: classData,
		isValidating: isClassValidating,
		mutate: updateClass,
	} = useFetchClassData({
		sessionToken,
		schoolId,
		pageSize: 1000,
		pageIndex: 1,
		schoolYearId: selectedSchoolYearId,
	});

	const {
		data: subjectData,
		mutate: updateSubject,
		isValidating: isSubjectValidating,
	} = useFetchSubject({
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
			if (timetableStored['generated-schedule-id']) {
				const tmpDisplayData: ITimetableDisplayData[] = generatedScheduleStored[
					'class-schedules'
				].map(
					(clazz: IClassSchedule) =>
						({
							classId: clazz['student-class-id'],
							className: clazz['student-class-name'],
							periods: clazz['class-periods'].map(
								(period: IClassPeriod) =>
									({
										slot: period['start-at'],
										subjectId: period['subject-id'],
										subjectAbbreviation: period['subject-abbreviation'],
										teacherId: period['teacher-id'],
										teacherName: period['teacher-abbreviation'],
									} as IPeriodDisplayData)
							),
						} as ITimetableDisplayData)
				);
				if (tmpDisplayData.length > 0) {
					setDisplayData(tmpDisplayData);
					setIsDataLoading(false);
				}
			} else {
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
							const assignedTeacher: ITeachingAssignmentObject | undefined =
								dataStored['teacher-assignments'].find(
									(item) => item['assignment-id'] === assignment.id
								);

							const availableTeacher: ITeacherResponse | undefined =
								teacherData.result.items.find(
									(teacher: ITeacherResponse) =>
										teacher.id === assignedTeacher?.['teacher-id']
								);

							if (availableTeacher) {
								// Assign giá trị vào trong class
								dataStored['fixed-periods-para'].forEach(
									(slot: IFixedPeriodObject) => {
										if (
											slot['class-id'] === assignment['student-class-id'] &&
											slot['subject-id'] === assignment['subject-id']
										) {
											const existingSubject: ISubjectResponse =
												subjectData.result.items.find(
													(subject: ISubjectResponse) =>
														subject.id === assignment['subject-id']
												);
											if (existingSubject) {
												tmpPeriods.push({
													slot: slot['start-at'],
													subjectId: assignment['subject-id'],
													subjectAbbreviation:
														existingSubject.abbreviation,
													teacherId: availableTeacher.id,
													teacherName: availableTeacher.abbreviation,
												} as IPeriodDisplayData);
											}
										}
									}
								);
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
	}, [classData, teacherData, dataStored, timetableStored, subjectData, generatedScheduleStored]);

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
		<div className='w-full h-full flex flex-col justify-start items-center'>
			{timetableStored['generated-schedule-id'] ? (
				<div className='w-full flex flex-row justify-center items-center gap-5 py-2'>
					<h1 className='text-title-small-strong opacity-60'>
						{generatedScheduleStored.name}
					</h1>
					<div className='w-fit h-full flex flex-row justify-start items-center gap-2'>
						<Image
							src={'/images/icons/dumbbell.png'}
							alt='dumbbell'
							width={15}
							height={15}
						/>
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
				<h1 className='py-2 text-title-small-strong opacity-60'>Các tiết xếp sẵn</h1>
			)}
			{isDataLoading ? (
				<div className='w-full h-[60%] max-h-[50vh] p-3 flex justify-center items-center overflow-y-scroll no-scrollbar'>
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
				<div className='w-full h-[90vh] pb-[20vh] overflow-scroll no-scrollbar'>
					<TableContainer sx={{ pb: 5 }}>
						<Table size='small'>
							<TableHead>
								<TableRow>
									<TableCell sx={{ border: '1px solid #ddd' }}>Thứ</TableCell>
									<TableCell sx={{ border: '1px solid #ddd' }}>Tiết</TableCell>
									{filteredData &&
										filteredData?.map((clazz: ITimetableDisplayData) => (
											<TableCell sx={{ border: '1px solid #ddd' }}>
												{clazz.className}
											</TableCell>
										))}
								</TableRow>
							</TableHead>
							<TableBody>
								{WEEK_DAYS.map((weekday: string, weekdayIndex: number) => (
									<>
										{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
											(slot: number, slotIndex: number) => (
												<TableRow>
													{slotIndex === 0 && (
														<TableCell
															sx={{
																border: '1px solid #ddd',
																width: 30,
															}}
															rowSpan={10}
														>
															{weekday}
														</TableCell>
													)}
													<TableCell
														sx={{
															border: '1px solid #ddd',
															width: 30,
															textAlign: 'center',
															fontWeight: 'bold',
														}}
														className={`${
															slotIndex < 5
																? 'text-primary-400'
																: 'text-tertiary-normal'
														}`}
													>
														{slot}
													</TableCell>
													{filteredData &&
														filteredData.map(
															(clazz: ITimetableDisplayData) => {
																const period = clazz.periods.find(
																	(item) =>
																		item.slot ===
																		slot + weekdayIndex * 10
																);
																if (period) {
																	return (
																		<TableCell
																			sx={{
																				border: '1px solid #ddd',
																				width: 50,
																				backgroundColor:
																					'#f0f0f0',
																			}}
																		>
																			{
																				period.subjectAbbreviation
																			}{' '}
																			- {period.teacherName}
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
															}
														)}
												</TableRow>
											)
										)}
									</>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</div>
			)}
		</div>
	);
};

export default PreviewScheduleTable;

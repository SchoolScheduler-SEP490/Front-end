'use client';
import { INoAssignPeriodObject, WEEK_DAYS } from '@/utils/constants';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { IPeriodDisplayData, ITimetableDisplayData } from '../../_libs/constants';
import useNotify from '@/hooks/useNotify';
import { ITimetableGenerationState } from '@/context/slice_timetable_generation';
import { useSMSelector } from '@/hooks/useReduxStore';

const getExistingSlot = (data: IPeriodDisplayData[], cellId: number) => {
	return data.find((slot) => slot.slot === cellId);
};

interface ITeacherTargetUnavailabilityTableProps {
	data: ITimetableDisplayData[];
	isMainSession: boolean;
	session: number;
	classId: number;
	selectedSlot: IPeriodDisplayData | null;
	selectedTarget: IPeriodDisplayData | null;
	setIsWarning: Dispatch<SetStateAction<boolean>>;
}

const TeacherTargetUnavailabilityTable = (props: ITeacherTargetUnavailabilityTableProps) => {
	const { data, isMainSession, session, selectedTarget, selectedSlot, classId, setIsWarning } =
		props;

	const [warningObject, setWarningObject] = useState<IPeriodDisplayData | null>(null);
	const { dataStored }: ITimetableGenerationState = useSMSelector(
		(state) => state.timetableGeneration
	);

	const teacherUnavailability: IPeriodDisplayData[] = useMemo((): IPeriodDisplayData[] => {
		if (data && selectedTarget && selectedTarget?.teacherId !== 0) {
			const tmpUnavailability: IPeriodDisplayData[] = [];

			// Tìm lịch dạy của giáo viên được chọn
			data.forEach((item: ITimetableDisplayData) => {
				item.periods.forEach((period: IPeriodDisplayData) => {
					if (period.teacherId === selectedTarget.teacherId) {
						tmpUnavailability.push(period);
					}
				});
			});

			// Tìm lịch bận của giáo viên
			if (dataStored['no-assign-periods-para'].length > 0) {
				dataStored['no-assign-periods-para'].forEach((item: INoAssignPeriodObject) => {
					if (item['teacher-id'] === selectedTarget.teacherId) {
						tmpUnavailability.push({
							slot: item['start-at'],
							classId: 0,
							className: '',
							roomId: 0,
							roomName: '',
							subjectAbbreviation: 'BẬN',
							subjectId: 0,
							teacherId: item['teacher-id'],
							teacherName: selectedTarget.teacherName,
						} as IPeriodDisplayData);
					}
				});
			}
			if (tmpUnavailability.length > 0) {
				return tmpUnavailability;
			}
		}
		return [];
	}, [selectedTarget]);

	useEffect(() => {
		const tmpWarningObject: IPeriodDisplayData | undefined = teacherUnavailability.find(
			(slot) => slot.slot === selectedSlot?.slot
		);
		if (tmpWarningObject) {
			setWarningObject(tmpWarningObject);
			setIsWarning(true);
			useNotify({
				message: `Giáo viên ${selectedSlot?.teacherName} đã bận vào buổi này`,
				type: 'warning',
			});
		} else {
			setWarningObject(null);
			setIsWarning(false);
		}
	}, [selectedSlot, selectedTarget, session, classId]);

	return (
		<TableContainer sx={{ maxWidth: 900, margin: 'auto' }}>
			{/* <Table onMouseUp={handleMouseUp} size='small' onMouseLeave={handleMouseUp}> */}
			<Table size='small'>
				<TableHead>
					<TableRow>
						<TableCell
							align='center'
							sx={{
								fontWeight: 'bold',
								width: 50,
								border: warningObject ? '1px solid #e66030' : '1px solid #ddd',
							}}
						>
							Buổi
						</TableCell>
						<TableCell
							align='center'
							sx={{
								fontWeight: 'bold',
								m: 0,
								p: 0,
								border: warningObject ? '1px solid #e66030' : '1px solid #ddd',
							}}
						>
							Tiết
						</TableCell>
						{WEEK_DAYS.map((day) => (
							<TableCell
								key={day}
								align='center'
								sx={{
									fontWeight: 'bold',
									border: warningObject ? '1px solid #e66030' : '1px solid #ddd',
								}}
							>
								{day}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{[1, 2, 3, 4, 5].map((slot, slotIndex) => (
						<TableRow key={`${slot}`}>
							{slotIndex === 0 && (
								<TableCell
									rowSpan={5}
									align='center'
									sx={{
										fontWeight: 'bold',
										border: warningObject ? '1px solid #e66030' : '1px solid #ddd',
									}}
								>
									<div className='w-full  flex flex-col justify-center items-center'>
										<h1 className='w-full text-center'>
											{slot + session * 5 <= 5 ? 'Sáng' : 'Chiều'}
										</h1>
										<p className='text-body-small font-light w-full text-center'>
											({isMainSession ? 'Chính khóa' : 'Trái buổi'})
										</p>
									</div>
								</TableCell>
							)}
							<TableCell
								align='center'
								className={`!font-semibold ${
									slot + session * 5 <= 5 ? '!text-primary-400' : '!text-tertiary-normal'
								}`}
								sx={{ m: 0, p: 0, border: warningObject ? '1px solid #e66030' : '1px solid #ddd' }}
							>
								{slot + session * 5}
							</TableCell>
							{WEEK_DAYS.map((day: string, weekdayIndex: number) => {
								const cellId = weekdayIndex * 10 + session * 5 + slotIndex + 1;
								const existingSlot = getExistingSlot(teacherUnavailability, cellId);
								return (
									<TableCell
										key={cellId}
										align='center'
										sx={{
											// cursor: 'pointer',
											userSelect: 'none',
											border: warningObject ? '1px solid #e66030' : '1px solid #ddd',
											':hover': {
												backgroundColor: '#f0f0f0',
											},
											minWidth: 40,
											maxWidth: 40,
											minHeight: 20,
											height: 25,
											maxHeight: 25,
											m: 0,
											p: 0,
										}}
									>
										{existingSlot ? (
											<div
												className={`w-full h-full flex flex-col justify-center items-center py-[2px] ${
													selectedSlot?.slot === cellId
														? 'bg-basic-negative-hover'
														: selectedTarget?.slot === cellId
														? 'bg-basic-positive-hover'
														: 'bg-white hover:bg-[#f0f0f0]'
												}`}
											>
												<p
													className={`w-full text-body-small leading-4 overflow-hidden text-ellipsis whitespace-nowrap font-semibold ${
														selectedSlot?.slot === cellId
															? 'text-basic-negative'
															: selectedTarget?.slot === cellId
															? 'text-basic-positive'
															: 'text-basic-gray'
													}`}
												>
													{existingSlot.subjectAbbreviation}
												</p>
												<p
													className={`text-body-small leading-4 ${
														selectedSlot?.slot === cellId
															? 'text-basic-negative opacity-60'
															: selectedTarget?.slot === cellId
															? 'text-basic-positive opacity-60'
															: 'text-basic-gray opacity-60'
													}`}
												>
													{existingSlot.className}
												</p>
											</div>
										) : (
											<div
												className={`w-full h-full flex flex-col justify-center items-center py-[2px] ${
													selectedSlot?.slot === cellId
														? 'bg-basic-negative-hover'
														: selectedTarget?.slot === cellId
														? 'bg-basic-positive-hover'
														: selectedTarget?.slot === cellId
														? 'bg-basic-positive-hover'
														: 'bg-white hover:bg-[#f0f0f0]'
												}`}
											>
												<p className='w-full text-body-small leading-4 overflow-hidden text-ellipsis whitespace-nowrap font-semibold opacity-0'>
													SOEMTHING
												</p>
												<p className='text-body-small leading-4 opacity-0'>something</p>
											</div>
										)}
									</TableCell>
								);
							})}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default TeacherTargetUnavailabilityTable;

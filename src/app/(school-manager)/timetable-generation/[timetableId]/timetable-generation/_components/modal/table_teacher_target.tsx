'use client';
import useNotify from '@/hooks/useNotify';
import { WEEK_DAYS } from '@/utils/constants';
import {
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
import { Dispatch, SetStateAction } from 'react';
import { IPeriodDisplayData, ISwitchPeriod, ITimetableDisplayData } from '../../_libs/constants';

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

const getExistingSlot = (data: IPeriodDisplayData[], cellId: number) => {
	return data.find((slot) => slot.slot === cellId);
};

const isDoubleSlot = (data: IPeriodDisplayData[], existingSlot: IPeriodDisplayData): boolean => {
	const eSlots: IPeriodDisplayData[] = data.filter(
		(slot) => slot.subjectId === existingSlot.subjectId
	);
	if (eSlots.length > 1) {
		let solution = false;
		eSlots.forEach((slot) => {
			if (Math.abs(slot.slot - existingSlot.slot) === 1) {
				solution = true;
			}
		});
		return solution;
	} else return false;
};

interface ITeacherSelectTableProps {
	classData: IPeriodDisplayData[];
	data: ITimetableDisplayData[];
	isMainSession: boolean;
	session: number;
	selectedSlot: IPeriodDisplayData | null;
	selectedTarget: ISwitchPeriod | null;
	setSelectedTarget: Dispatch<SetStateAction<ISwitchPeriod | null>>;
	selectedSlotUnavailability: IPeriodDisplayData[];
	setSelectedSlot: Dispatch<SetStateAction<ISwitchPeriod | null>>;
}

const TeacherTargetTable = (props: ITeacherSelectTableProps) => {
	const {
		classData,
		data,
		isMainSession,
		session,
		selectedSlot,
		selectedTarget,
		setSelectedTarget,
		selectedSlotUnavailability,
		setSelectedSlot,
	} = props;

	const handleSelectTarget = (slot: IPeriodDisplayData) => {
		if (slot.slot === selectedTarget?.slot) {
			setSelectedTarget(null);
		} else {
			setSelectedTarget({ ...slot, isDoubleSlot: isDoubleSlot(classData, slot) });
		}
	};

	return (
		<TableContainer sx={{ maxWidth: 900, margin: 'auto' }}>
			{/* <Table onMouseUp={handleMouseUp} size='small' onMouseLeave={handleMouseUp}> */}
			<Table size='small'>
				<TableHead>
					<TableRow>
						<TableCell
							align='center'
							sx={{ fontWeight: 'bold', width: 50, border: '1px solid #ddd' }}
						>
							Buổi
						</TableCell>
						<TableCell
							align='center'
							sx={{ fontWeight: 'bold', border: '1px solid #ddd', m: 0, p: 0 }}
						>
							Tiết
						</TableCell>
						{WEEK_DAYS.map((day) => (
							<TableCell
								key={day}
								align='center'
								sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}
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
										border: '1px solid #ddd',
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
								sx={{ m: 0, p: 0, maxWidth: 10 }}
							>
								{slot + session * 5}
							</TableCell>
							{WEEK_DAYS.map((day: string, weekdayIndex: number) => {
								const cellId = weekdayIndex * 10 + session * 5 + slotIndex + 1;
								const existingSlot = getExistingSlot(classData, cellId);
								const isOccupiedSlot: boolean = selectedSlotUnavailability.some(
									(item) => item.slot === cellId
								);
								return (
									<TableCell
										key={cellId}
										align='center'
										sx={{
											cursor: isOccupiedSlot ? 'default' : 'pointer',
											userSelect: 'none',
											border: '1px solid #ddd',
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
										onClick={() => {
											if (selectedSlot?.slot === cellId) {
												setSelectedSlot(null);
											} else if (
												selectedSlot?.slot !== cellId &&
												!(selectedSlot?.subjectId === existingSlot?.subjectId) &&
												!isOccupiedSlot
											) {
												handleSelectTarget(
													existingSlot ??
														({
															teacherId: 0,
															teacherName: 'none',
															subjectId: 0,
															subjectAbbreviation: 'none',
															slot: cellId,
														} as IPeriodDisplayData)
												);
											} else if (
												selectedSlot?.subjectId === existingSlot?.subjectId &&
												(selectedSlot?.subjectId !== 0 || existingSlot?.subjectId !== 0)
											) {
												useNotify({
													message: 'Không thể đổi tiết của cùng một môn học',
													type: 'error',
												});
											}
										}}
									>
										{existingSlot ? (
											<LightTooltip
												arrow
												placement='right'
												title={`${
													isOccupiedSlot && !(selectedSlot?.slot === cellId)
														? 'Các giáo viên bị trùng lịch dạy'
														: ''
												}`}
											>
												<div
													className={`w-full h-full flex flex-col justify-center items-center py-[2px] ${
														selectedSlot?.slot === cellId
															? 'bg-basic-negative-hover'
															: selectedTarget?.slot === cellId
															? 'bg-basic-positive-hover'
															: isOccupiedSlot
															? 'bg-gray-100'
															: 'bg-white hover:bg-[#f0f0f0]'
													}`}
												>
													<p
														className={`w-full text-body-small leading-4 overflow-hidden text-ellipsis whitespace-nowrap font-semibold ${
															selectedSlot?.slot === cellId
																? 'text-basic-negative'
																: selectedTarget?.slot === cellId
																? 'text-basic-positive'
																: isOccupiedSlot
																? 'text-basic-gray opacity-60'
																: 'text-primary-300'
														}`}
													>
														{existingSlot.subjectAbbreviation}
													</p>
													<p
														className={`text-body-small leading-4  ${
															selectedTarget?.slot === cellId
																? 'text-basic-positive opacity-60'
																: selectedSlot?.slot === cellId
																? 'text-basic-negative opacity-60'
																: isOccupiedSlot
																? 'text-basic-gray opacity-60'
																: 'text-basic-gray'
														}`}
													>
														{existingSlot.teacherName}
													</p>
												</div>
											</LightTooltip>
										) : (
											<div
												className={`w-full h-full flex flex-col justify-center items-center py-[2px] ${
													selectedSlot?.slot === cellId
														? 'bg-basic-negative-hover'
														: selectedTarget?.slot === cellId
														? 'bg-basic-positive-hover'
														: isOccupiedSlot
														? 'bg-gray-100'
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

export default TeacherTargetTable;

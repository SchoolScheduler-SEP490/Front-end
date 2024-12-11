'use client';
import useNotify from '@/hooks/useNotify';
import { WEEK_DAYS } from '@/utils/constants';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { IPeriodDisplayData, ISwitchPeriod } from '../../_libs/constants';

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
	data: IPeriodDisplayData[];
	isMainSession: boolean;
	session: number;
	selectedSlot: ISwitchPeriod | null;
	setSelectedSlot: Dispatch<SetStateAction<ISwitchPeriod | null>>;
	selectedTarget: IPeriodDisplayData | null;
	setSelectedTarget: Dispatch<SetStateAction<ISwitchPeriod | null>>;
}

const TeacherSelectTable = (props: ITeacherSelectTableProps) => {
	const {
		data,
		isMainSession,
		session,
		selectedSlot,
		setSelectedSlot,
		selectedTarget,
		setSelectedTarget,
	} = props;

	const handleSelectSlot = (slot: IPeriodDisplayData | null) => {
		if (!slot) {
			return;
		}

		if (slot && slot.slot === selectedSlot?.slot) {
			setSelectedSlot(null);
		} else {
			setSelectedSlot({ ...slot, isDoubleSlot: isDoubleSlot(data, slot) });
		}
	};

	return (
		<TableContainer sx={{ maxWidth: 900, margin: 'auto' }}>
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
								sx={{ m: 0, p: 0 }}
							>
								{slot + session * 5}
							</TableCell>
							{WEEK_DAYS.map((day: string, weekdayIndex: number) => {
								const cellId = weekdayIndex * 10 + session * 5 + slotIndex + 1;
								const existingSlot = getExistingSlot(data, cellId);
								return (
									<TableCell
										key={cellId}
										align='center'
										sx={{
											cursor: 'pointer',
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
											if (selectedTarget?.slot === cellId) {
												// Nếu click vào slot đã chọn thì bỏ chọn
												setSelectedTarget(null);
											} else if (
												selectedTarget?.slot !== cellId &&
												!(selectedTarget?.subjectId === existingSlot?.subjectId)
											) {
												// Nếu click vào slot khác và khác môn thì chọn slot đó
												handleSelectSlot(existingSlot ?? null);
											} else if (selectedTarget?.subjectId === existingSlot?.subjectId) {
												useNotify({
													message: 'Không thể chọn tiết trống/tiết của cùng một môn',
													type: 'error',
												});
											}
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
															: selectedSlot === null
															? 'text-primary-300'
															: 'text-basic-gray opacity-60'
													}`}
												>
													{existingSlot.subjectAbbreviation}
												</p>
												<p
													className={`text-body-small leading-4  ${
														selectedSlot?.slot === cellId
															? 'text-basic-negative opacity-60'
															: selectedTarget?.slot === cellId
															? 'text-basic-positive opacity-60'
															: selectedSlot === null
															? 'text-basic-gray'
															: 'text-basic-gray opacity-60'
													}`}
												>
													{existingSlot.teacherName}
												</p>
											</div>
										) : (
											<div
												className={`w-full h-full flex flex-col justify-center items-center py-[2px] ${
													selectedSlot?.slot === cellId
														? 'bg-basic-negative-hover'
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

export default TeacherSelectTable;

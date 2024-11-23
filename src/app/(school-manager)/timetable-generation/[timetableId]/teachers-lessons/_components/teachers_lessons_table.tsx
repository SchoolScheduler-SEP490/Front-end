import ListIcon from '@mui/icons-material/List';
import TableChartSharpIcon from '@mui/icons-material/TableChartSharp';
import {
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	ToggleButton,
	ToggleButtonGroup,
	Toolbar,
} from '@mui/material';
import { MouseEvent, useState } from 'react';
import DriveFileRenameOutlineSharpIcon from '@mui/icons-material/DriveFileRenameOutlineSharp';
import { TIMETABLE_SLOTS, WEEK_DAYS } from '@/utils/constants';

interface EnhancedTableProps {
	numberOfSlots: number;
}
function EnhancedTableHead(props: EnhancedTableProps) {
	const { numberOfSlots } = props;
	return (
		<TableHead>
			<TableRow>
				<TableCell
					rowSpan={2}
					sx={{
						fontWeight: 'bold',
						borderRight: '1px solid #f0f0f0',
						borderLeft: '1px solid #f0f0f0',
						borderTop: '1px solid #f0f0f0',
					}}
				>
					Môn học
				</TableCell>
				<TableCell
					rowSpan={2}
					sx={{
						fontWeight: 'bold',
						borderRight: '1px solid #f0f0f0',
						borderLeft: '1px solid #f0f0f0',
						borderTop: '1px solid #f0f0f0',
					}}
				>
					Giáo viên
				</TableCell>
				<TableCell
					colSpan={numberOfSlots}
					sx={{
						fontWeight: 'bold',
						borderRight: '1px solid #f0f0f0',
						borderLeft: '1px solid #f0f0f0',
						borderTop: '1px solid #f0f0f0',
					}}
				>
					Tiết học
				</TableCell>
				<TableCell
					rowSpan={2}
					sx={{
						fontWeight: 'bold',
						borderRight: '1px solid #f0f0f0',
						borderLeft: '1px solid #f0f0f0',
						borderTop: '1px solid #f0f0f0',
					}}
				></TableCell>
			</TableRow>
			<TableRow>
				{Array.from({ length: numberOfSlots }, (_, index) => (
					<TableCell
						key={index}
						sx={{
							fontWeight: 'bold',
							borderRight: '1px solid #f0f0f0',
							borderLeft: '1px solid #f0f0f0',
							borderTop: '1px solid #f0f0f0',
						}}
					>
						Tiết {index + 1}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

const rows = [
	{
		monHoc: 'Toán',
		giaoVien: 'Hoàng',
		tiet1: 'T2.S1',
		tiet2: 'T2.S2',
		tiet3: 'T3.S1',
		tiet4: 'T6.S3',
		tiet5: 'T6.S4',
	},
	{
		monHoc: 'Văn',
		giaoVien: 'Lan',
		tiet1: 'T3.S1',
		tiet2: 'T3.S2',
		tiet3: 'T4.S1',
		tiet4: 'T5.S3',
		tiet5: 'T5.S4',
	},
	{
		monHoc: 'Anh',
		giaoVien: 'Minh',
		tiet1: 'T2.S1',
		tiet2: 'T2.S2',
		tiet3: 'T3.S1',
		tiet4: 'T4.S3',
		tiet5: 'T4.S4',
	},
	{
		monHoc: 'Lý',
		giaoVien: 'Hùng',
		tiet1: 'T3.S1',
		tiet2: 'T3.S2',
		tiet3: 'T4.S1',
		tiet4: 'T6.S3',
		tiet5: 'T6.S4',
	},
	{
		monHoc: 'Hóa',
		giaoVien: 'Hà',
		tiet1: 'T2.S1',
		tiet2: 'T2.S2',
		tiet3: 'T3.S1',
		tiet4: 'T5.S3',
		tiet5: 'T5.S4',
	},
	{
		monHoc: 'Sinh',
		giaoVien: 'Mai',
		tiet1: 'T3.S1',
		tiet2: 'T3.S2',
		tiet3: 'T4.S1',
		tiet4: 'T6.S3',
		tiet5: 'T6.S4',
	},
	{
		monHoc: 'Sử',
		giaoVien: 'Tùng',
		tiet1: 'T2.S1',
		tiet2: 'T2.S2',
		tiet3: 'T3.S1',
		tiet4: 'T4.S3',
		tiet5: 'T4.S4',
	},
	{
		monHoc: 'Địa',
		giaoVien: 'Hương',
		tiet1: 'T3.S1',
		tiet2: 'T3.S2',
		tiet3: 'T4.S1',
		tiet4: 'T5.S3',
		tiet5: 'T5.S4',
	},
	{
		monHoc: 'GDCD',
		giaoVien: 'Phúc',
		tiet1: 'T2.S1',
		tiet2: 'T2.S2',
		tiet3: 'T3.S1',
		tiet4: 'T6.S3',
		tiet5: 'T6.S4',
	},
	{
		monHoc: 'Tin',
		giaoVien: 'Dũng',
		tiet1: 'T3.S1',
		tiet2: 'T3.S2',
		tiet3: 'T4.S1',
		tiet4: 'T5.S3',
		tiet5: 'T5.S4',
	},
	{
		monHoc: 'Thể dục',
		giaoVien: 'Hải',
		tiet1: 'T2.S1',
		tiet2: 'T2.S2',
		tiet3: 'T3.S1',
		tiet4: 'T4.S3',
		tiet5: 'T4.S4',
	},
];

interface ITeachersLessonsTableProps {
	// Add something here
}

const TeachersLessonsTable = (props: ITeachersLessonsTableProps) => {
	const [alignment, setAlignment] = useState('list');
	const [maxSlots, setMaxSlots] = useState<number>(5);

	const handleChange = (event: MouseEvent<HTMLElement>, newAlignment: string) => {
		if (!(alignment === newAlignment)) {
			setAlignment(newAlignment);
		}
	};
	return (
		<div className='w-full h-fit flex justify-start items-center '>
			{alignment === 'list' && (
				<Paper sx={{ width: '100%', mb: 2 }}>
					<Toolbar>
						<div className='w-full flex flex-row justify-start items-baseline'>
							<ToggleButtonGroup
								color='primary'
								value={alignment}
								exclusive
								onChange={handleChange}
								aria-label='Platform'
								sx={{ height: 35 }}
							>
								<ToggleButton value='list'>
									<ListIcon sx={{ mr: 1 }} />
									Lịch
								</ToggleButton>
								<ToggleButton value='grid'>
									<TableChartSharpIcon fontSize='small' sx={{ mr: 1 }} />
									TKB
								</ToggleButton>
							</ToggleButtonGroup>
						</div>
						<div className='w-full h-[5vh] flex flex-row justify-end items-end gap-1'>
							<h3 className='text-body-medium opacity-80'>GVCN: </h3>
							<h2 className='text-body-medium-strong font-normal'>PhuongLHK</h2>
						</div>
					</Toolbar>
					<TableContainer>
						<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size='small'>
							<EnhancedTableHead numberOfSlots={maxSlots} />
							<TableBody>
								{rows.map((row, index) => (
									<TableRow key={index}>
										<TableCell>{row.monHoc}</TableCell>
										<TableCell>{row.giaoVien}</TableCell>
										<TableCell>{row.tiet1}</TableCell>
										<TableCell>{row.tiet2}</TableCell>
										<TableCell>{row.tiet3}</TableCell>
										<TableCell>{row.tiet4}</TableCell>
										<TableCell>{row.tiet5}</TableCell>
										<TableCell width={50}>
											<IconButton>
												<DriveFileRenameOutlineSharpIcon />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Paper>
			)}
			{alignment === 'grid' && (
				<Paper sx={{ width: '100%', mb: 2 }}>
					<Toolbar>
						<div className='w-full flex flex-row justify-start items-baseline'>
							<ToggleButtonGroup
								color='primary'
								value={alignment}
								exclusive
								onChange={handleChange}
								aria-label='Platform'
								sx={{ height: 35 }}
							>
								<ToggleButton value='list'>
									<ListIcon sx={{ mr: 1 }} />
									Lịch
								</ToggleButton>
								<ToggleButton value='grid'>
									<TableChartSharpIcon fontSize='small' sx={{ mr: 1 }} />
									TKB
								</ToggleButton>
							</ToggleButtonGroup>
						</div>
						<div className='w-full h-[5vh] flex flex-row justify-end items-end gap-1'>
							<h3 className='text-body-medium opacity-80'>GVCN:</h3>
							<h2 className='text-body-medium-strong font-normal'>PhuongLHK</h2>
						</div>
					</Toolbar>
					<TableContainer component={Paper} sx={{ maxWidth: 900, margin: 'auto' }}>
						{/* <Table onMouseUp={handleMouseUp} size='small' onMouseLeave={handleMouseUp}> */}
						<Table>
							<TableHead>
								<TableRow>
									<TableCell
										align='center'
										sx={{ fontWeight: 'bold', width: 80 }}
									>
										Buổi
									</TableCell>
									<TableCell
										align='center'
										sx={{ fontWeight: 'bold', width: 80 }}
									>
										Tiết
									</TableCell>
									{WEEK_DAYS.map((day) => (
										<TableCell
											key={day}
											align='center'
											sx={{ fontWeight: 'bold' }}
										>
											{day}
										</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{TIMETABLE_SLOTS.map((session, i) => (
									<>
										{session.slots.map((slot, index) => (
											<TableRow key={`${session.period}-${slot}`}>
												{index === 0 && (
													<TableCell
														rowSpan={session.slots.length}
														align='center'
														sx={{
															fontWeight: 'bold',
															border: '1px solid #ddd',
														}}
													>
														{session.period}
													</TableCell>
												)}
												<TableCell align='center'>{slot}</TableCell>
												{WEEK_DAYS.map((day) => {
													const cellId = `${day}-${session.period}-${slot}`;
													// const isSelected =
													// 	selectedCells[cellId]?.selected || false;
													return (
														<TableCell
															key={cellId}
															align='center'
															sx={{
																// backgroundColor: isSelected
																// 	? '#E0E0E0'
																// 	: 'transparent',
																cursor: 'pointer',
																userSelect: 'none',
																border: '1px solid #ddd',
															}}
															// onMouseDown={() =>
															// 	handleMouseDown(cellId)
															// }
															// onMouseEnter={() =>
															// 	handleMouseEnter(cellId)
															// }
														>
															{/* <Collapse in={isSelected} timeout={200}>
																<Typography fontSize={13}>
																	<ClearIcon
																		fontSize='small'
																		sx={{ opacity: 0.6 }}
																	/>
																</Typography>
															</Collapse> */}
														</TableCell>
													);
												})}
											</TableRow>
										))}
										{i === 0 && (
											<TableRow key={i}>
												<TableCell
													colSpan={WEEK_DAYS.length - 1}
												></TableCell>
											</TableRow>
										)}
									</>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Paper>
			)}
		</div>
	);
};

export default TeachersLessonsTable;

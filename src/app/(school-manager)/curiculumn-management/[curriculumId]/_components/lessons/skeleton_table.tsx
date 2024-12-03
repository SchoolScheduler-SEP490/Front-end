'use client';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Button, Checkbox, Skeleton, TableHead, Toolbar, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { ILessonTableData } from '../../_libs/constants';

interface ISumObject {
	'main-slot-per-week': number;
	'sub-slot-per-week': number;
	'main-minimum-couple': number;
	'sub-minimum-couple': number;
}
interface HeadCell {
	disablePadding: boolean;
	id: keyof ILessonTableData;
	label: string;
	centered: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id' as keyof ILessonTableData,
		centered: true,
		disablePadding: true,
		label: 'STT',
	},
	{
		id: 'lessonName' as keyof ILessonTableData,
		centered: false,
		disablePadding: false,
		label: 'Tên',
	},
	{
		id: 'mainSeason' as keyof ILessonTableData,
		centered: true,
		disablePadding: true,
		label: 'Chính khóa',
	},
	{
		id: 'subSeason' as keyof ILessonTableData,
		centered: true,
		disablePadding: false,
		label: 'Trái buổi',
	},
	{
		id: 'doubleAvailability' as keyof ILessonTableData,
		centered: true,
		disablePadding: false,
		label: 'Môn học có tiết cặp',
	},
	{
		id: 'isRequired' as keyof ILessonTableData,
		centered: true,
		disablePadding: false,
		label: 'Môn học chuyên đề',
	},
];
interface EnhancedTableProps {
	totalSlot: ISumObject;
}
function EnhancedTableHead(props: EnhancedTableProps) {
	const { totalSlot } = props;
	return (
		<TableHead>
			<TableRow>
				<TableCell
					rowSpan={2}
					align={headCells[0].centered ? 'center' : 'left'}
					padding={headCells[0].disablePadding ? 'none' : 'normal'}
					width={30}
					sx={[
						{
							fontWeight: 'bold',
							borderRight: '1px solid #f0f0f0',
							borderLeft: '1px solid #f0f0f0',
							borderTop: '1px solid #f0f0f0',
						},
					]}
				>
					{headCells[0].label}
				</TableCell>
				<TableCell
					rowSpan={2}
					align={headCells[1].centered ? 'center' : 'left'}
					padding={headCells[1].disablePadding ? 'none' : 'normal'}
					sx={[
						{
							fontWeight: 'bold',
							borderRight: '1px solid #f0f0f0',
							borderLeft: '1px solid #f0f0f0',
							borderTop: '1px solid #f0f0f0',
						},
						headCells[1].centered ? { paddingLeft: '3%' } : {},
					]}
				>
					{headCells[1].label}
				</TableCell>
				<TableCell
					colSpan={2}
					align={'center'}
					padding={'normal'}
					sx={[
						{
							fontWeight: 'bold',
							paddingLeft: '3%',
							borderRight: '1px solid #f0f0f0',
							borderLeft: '1px solid #f0f0f0',
							borderTop: '1px solid #f0f0f0',
						},
					]}
				>
					Chính khóa
				</TableCell>
				<TableCell
					colSpan={2}
					align={'center'}
					padding={'normal'}
					sx={[
						{
							fontWeight: 'bold',
							paddingLeft: '3%',
							borderRight: '1px solid #f0f0f0',
							borderLeft: '1px solid #f0f0f0',
							borderTop: '1px solid #f0f0f0',
						},
					]}
				>
					Trái buổi
				</TableCell>
				<TableCell
					rowSpan={2}
					align={headCells[headCells.length - 1].centered ? 'center' : 'left'}
					padding={headCells[headCells.length - 1].disablePadding ? 'none' : 'normal'}
					sx={[
						{
							fontWeight: 'bold',
							borderRight: '1px solid #f0f0f0',
							borderLeft: '1px solid #f0f0f0',
							borderTop: '1px solid #f0f0f0',
						},
					]}
				>
					{headCells[headCells.length - 2].label}
				</TableCell>
				<TableCell
					rowSpan={2}
					align={headCells[headCells.length - 1].centered ? 'center' : 'left'}
					padding={headCells[headCells.length - 1].disablePadding ? 'none' : 'normal'}
					sx={[
						{
							fontWeight: 'bold',
							borderRight: '1px solid #f0f0f0',
							borderLeft: '1px solid #f0f0f0',
							borderTop: '1px solid #f0f0f0',
						},
					]}
				>
					{headCells[headCells.length - 1].label}
					<p className='!italic !text-[11px] !font-light opacity-60'>(Chỉ đọc)</p>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell
					align={headCells[3].centered ? 'center' : 'left'}
					padding={headCells[3].disablePadding ? 'none' : 'normal'}
					sx={[
						{
							fontWeight: 'bold',
							borderRight: '1px solid #f0f0f0',
							borderLeft: '1px solid #f0f0f0',
							borderTop: '1px solid #f0f0f0',
						},
					]}
				>
					Tổng số tiết mỗi tuần{' '}
					<Typography
						fontSize={12}
						fontStyle={'normal'}
						color={totalSlot?.['main-slot-per-week'] > 30 ? 'error' : 'black'}
					>
						({totalSlot?.['main-slot-per-week'] ?? 0})
					</Typography>
				</TableCell>

				<TableCell
					align={headCells[4].centered ? 'center' : 'left'}
					padding={headCells[4].disablePadding ? 'none' : 'normal'}
					sx={[
						{
							fontWeight: 'bold',
							borderRight: '1px solid #f0f0f0',
							borderLeft: '1px solid #f0f0f0',
							borderTop: '1px solid #f0f0f0',
						},
					]}
				>
					Số tiết cặp tối thiểu{' '}
					<Typography
						fontSize={12}
						fontStyle={'normal'}
						color={totalSlot?.['main-minimum-couple'] > 12 ? 'error' : 'black'}
					>
						({totalSlot?.['main-minimum-couple'] ?? 0})
					</Typography>
				</TableCell>

				<TableCell
					align={headCells[3].centered ? 'center' : 'left'}
					padding={headCells[3].disablePadding ? 'none' : 'normal'}
					sx={[
						{
							fontWeight: 'bold',
							borderRight: '1px solid #f0f0f0',
							borderLeft: '1px solid #f0f0f0',
							borderTop: '1px solid #f0f0f0',
						},
					]}
				>
					Tổng số tiết mỗi tuần{' '}
					<Typography
						fontSize={12}
						fontStyle={'normal'}
						color={totalSlot?.['sub-slot-per-week'] > 30 ? 'error' : 'black'}
					>
						({totalSlot?.['sub-slot-per-week'] ?? 0})
					</Typography>
				</TableCell>

				<TableCell
					align={headCells[4].centered ? 'center' : 'left'}
					padding={headCells[4].disablePadding ? 'none' : 'normal'}
					sx={[
						{
							fontWeight: 'bold',
							borderRight: '1px solid #f0f0f0',
							borderLeft: '1px solid #f0f0f0',
							borderTop: '1px solid #f0f0f0',
						},
					]}
				>
					Số tiết cặp tối thiểu{' '}
					<Typography
						fontSize={12}
						fontStyle={'normal'}
						color={totalSlot?.['sub-minimum-couple'] > 12 ? 'error' : 'black'}
					>
						({totalSlot?.['sub-minimum-couple'] ?? 0})
					</Typography>
				</TableCell>
			</TableRow>
		</TableHead>
	);
}
const LessonTableSkeleton = () => {
	return (
		<Box
			sx={{
				width: '100%',
				paddingX: '2vw',
				mb: '5%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Paper sx={{ width: '100%', mb: 2 }}>
				<Toolbar
					sx={[
						{
							pl: { sm: 2 },
							pr: { xs: 1, sm: 1 },
							width: '100%',
						},
					]}
				>
					<div className='w-full flex flex-row justify-start items-baseline'>
						<h2 className='text-title-medium-strong font-semibold w-[15%] text-left'>Tiết học</h2>
						<div
							className='text-body-medium-strong font-normal leading-4 opacity-80 flex flex-row justify-between items-center cursor-pointer'
							id='basic-button'
						>
							<Skeleton animation='wave' variant='text' sx={{ width: 120, fontSize: '1.250rem' }} />
							<KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
						</div>
					</div>
					<div className='h-fit w-fit flex flex-row justify-center items-center gap-2 pr-2'></div>
				</Toolbar>
				<TableContainer>
					<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size='small'>
						<EnhancedTableHead
							totalSlot={{
								'main-slot-per-week': 0,
								'sub-slot-per-week': 0,
								'main-minimum-couple': 0,
								'sub-minimum-couple': 0,
							}}
						/>
						<TableBody>
							{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((row, index) => {
								return (
									<TableRow hover role='checkbox' tabIndex={-1} key={index}>
										<TableCell component='th' scope='row' padding='none' align='center' width={30}>
											<Skeleton animation='wave' variant='text' />
										</TableCell>
										<TableCell align='left' width={150}>
											<Skeleton animation='wave' variant='text' />
										</TableCell>
										<TableCell align='center' width={100}>
											<Skeleton animation='wave' variant='text' />
										</TableCell>
										<TableCell align='center' width={100}>
											<Skeleton animation='wave' variant='text' />
										</TableCell>
										<TableCell align='center' width={100}>
											<Skeleton animation='wave' variant='text' />
										</TableCell>
										<TableCell align='center' width={100}>
											<Skeleton animation='wave' variant='text' />
										</TableCell>
										<TableCell align='center' width={50}>
											<Checkbox color='default' checked={false} />
										</TableCell>
										<TableCell width={50} align='center'>
											<Checkbox disabled checked={false} />
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</Box>
	);
};

export default LessonTableSkeleton;

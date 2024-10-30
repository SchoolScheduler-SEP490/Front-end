'use client';

import FilterListIcon from '@mui/icons-material/FilterList';
import { Checkbox, TableHead, Toolbar, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';

interface ILessonTableData {
	id: number;
	lessonName: string;
	mainTotalSlotPerWeek: number;
	mainMinOfDouleSlot: number;
	subTotalSlotPerWeek: number;
	subMinOfDouleSlot: number;
	doubleAvailability: boolean;
}

interface IClassGroupData {
	classGroupName: string;
	classes: string[];
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
		disablePadding: false,
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
		label: 'Môn học bắt buộc',
	},
];

interface EnhancedTableProps {
	rowCount: number;
}
function EnhancedTableHead(props: EnhancedTableProps) {
	const { rowCount } = props;

	return (
		<TableHead>
			<TableRow>
				<TableCell
					rowSpan={2}
					align={headCells[0].centered ? 'center' : 'left'}
					padding={headCells[0].disablePadding ? 'none' : 'normal'}
					width={50}
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
					padding={
						headCells[headCells.length - 1].disablePadding ? 'none' : 'normal'
					}
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
					<p className='!italic !text-[11px] !font-light opacity-60'>
						(Chỉ đọc)
					</p>
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
						headCells[0].centered ? { paddingLeft: '3%' } : {},
					]}
				>
					Tổng số tiết mỗi tuần
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
						headCells[0].centered ? { paddingLeft: '3%' } : {},
					]}
				>
					Môn học có tiết cặp
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
						headCells[0].centered ? { paddingLeft: '3%' } : {},
					]}
				>
					Tổng số tiết mỗi tuần
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
						headCells[0].centered ? { paddingLeft: '3%' } : {},
					]}
				>
					Môn học có tiết cặp
				</TableCell>
			</TableRow>
		</TableHead>
	);
}

interface ILessonTableProps {
	subjectTableData: any[];
}
const LessonTable: React.FC<ILessonTableProps> = (props) => {
	const { subjectTableData } = props;

	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - subjectTableData.length) : 0;
	return (
		<Box
			sx={{
				width: '100%',
				paddingTop: '5vh',
				paddingX: '2vw',
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
					<h2 className='text-title-medium-strong font-semibold w-full text-left'>
						Tiết học
					</h2>
					<Tooltip title='Filter list'>
						<IconButton>
							<FilterListIcon />
						</IconButton>
					</Tooltip>
				</Toolbar>
				<TableContainer>
					<Table
						sx={{ minWidth: 750 }}
						aria-labelledby='tableTitle'
						size='medium'
					>
						<EnhancedTableHead rowCount={subjectTableData.length} />
						<TableBody>
							{subjectTableData.map((row, index) => {
								const labelId = `enhanced-table-checkbox-${index}`;

								return (
									<TableRow
										hover
										role='checkbox'
										tabIndex={-1}
										key={row.id}
										sx={{ cursor: 'pointer' }}
									>
										<TableCell
											component='th'
											id={labelId}
											scope='row'
											padding='none'
											align='center'
											width={50}
										>
											{row.id}
										</TableCell>
										<TableCell align='left' width={150}>
											{row.lessonName}
										</TableCell>
										<TableCell align='center' width={100}>
											{row.mainTotalSlotPerWeek ?? '-----'}
										</TableCell>
										<TableCell align='center' width={100}>
											{row.mainMinOfDouleSlot ?? '-----'}
										</TableCell>
										<TableCell align='center' width={100}>
											{row.subTotalSlotPerWeek ?? '-----'}
										</TableCell>
										<TableCell align='center' width={100}>
											{row.subMinOfDouleSlot ?? '-----'}
										</TableCell>
										<TableCell width={50} align='center'>
											<Checkbox
												color='default'
												disabled
												checked={row.doubleAvailability}
												inputProps={{
													'aria-labelledby': labelId,
												}}
											/>
										</TableCell>
									</TableRow>
								);
							})}
							{emptyRows > 0 && (
								<TableRow
									style={{
										height: 40 * emptyRows,
									}}
								>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component='div'
					count={subjectTableData.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</Box>
	);
};

export default LessonTable;

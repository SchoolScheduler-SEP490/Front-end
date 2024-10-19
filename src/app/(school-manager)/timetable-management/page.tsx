'use client';

import SMHeader from '@/commons/school_manager/header';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import { visuallyHidden } from '@mui/utils';
import * as React from 'react';

interface ITimetableTableData {
	id: number;
	timetableCode: string;
	timetableName: string;
	appliedDate: string;
	endDate: string;
	fitness: number;
	status: string;
}

function importRecord(
	id: number,
	timetableCode: string,
	timetableName: string,
	appliedDate: string,
	endDate: string,
	fitness: number,
	status: string
): ITimetableTableData {
	return {
		id,
		timetableCode,
		timetableName,
		appliedDate,
		endDate,
		fitness,
		status,
	};
}

const timetableTableData: ITimetableTableData[] = [
	importRecord(
		1,
		'T01',
		'Thời khóa biểu 1',
		'2022-09-01',
		'2022-09-30',
		100,
		'Công bố'
	),
	importRecord(
		2,
		'T02',
		'Thời khóa biểu 2',
		'2022-09-01',
		'2022-09-30',
		60,
		'Chờ duyệt'
	),
	importRecord(
		3,
		'T03',
		'Thời khóa biểu 3',
		'2022-09-01',
		'2022-09-30',
		80,
		'Chờ duyệt'
	),
	importRecord(4, 'T04', 'Thời khóa biểu 4', '2022-09-01', '2022-09-30', 5, 'Vô hiệu'),
	importRecord(5, 'T05', 'Thời khóa biểu 5', '2022-09-01', '2022-09-30', 95, 'Vô hiệu'),
	importRecord(6, 'T06', 'Thời khóa biểu 6', '2022-09-01', '2022-09-30', 69, 'Vô hiệu'),
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
	order: Order,
	orderBy: Key
): (
	a: { [key in Key]: number | string },
	b: { [key in Key]: number | string }
) => number {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof ITimetableTableData;
	label: string;
	centered: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id' as keyof ITimetableTableData,
		centered: true,
		disablePadding: false,
		label: 'Mã TKB',
	},
	{
		id: 'timetableName' as keyof ITimetableTableData,
		centered: false,
		disablePadding: false,
		label: 'Tên',
	},
	{
		id: 'appliedDate' as keyof ITimetableTableData,
		centered: true,
		disablePadding: false,
		label: 'Ngày áp dụng',
	},
	{
		id: 'endDate' as keyof ITimetableTableData,
		centered: true,
		disablePadding: false,
		label: 'Ngày kết thúc',
	},
	{
		id: 'fitness' as keyof ITimetableTableData,
		centered: true,
		disablePadding: false,
		label: 'Độ phù hợp',
	},
	{
		id: 'status' as keyof ITimetableTableData,
		centered: true,
		disablePadding: false,
		label: 'Trạng thái',
	},
];

// For extrafunction of Table head (filter, sort, etc.)
interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (
		event: React.MouseEvent<unknown>,
		property: keyof ITimetableTableData
	) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}
function EnhancedTableHead(props: EnhancedTableProps) {
	const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
		props;
	const createSortHandler =
		(property: keyof ITimetableTableData) => (event: React.MouseEvent<unknown>) => {
			onRequestSort(event, property);
		};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding='checkbox'>
					<Checkbox
						color='primary'
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{
							'aria-label': 'select all desserts',
						}}
					/>
				</TableCell>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.centered ? 'center' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sortDirection={orderBy === headCell.id ? order : false}
						sx={{ fontWeight: 'bold', paddingLeft: '3%' }}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box
									component='span'
									sx={[
										visuallyHidden,
										{ position: 'absolute', zIndex: 10 },
									]}
								>
									{order === 'desc'
										? 'sorted descending'
										: 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

// For extrafunction of Table toolbar (delete, filter, etc.)
interface EnhancedTableToolbarProps {
	numSelected: number;
}
function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
	const { numSelected } = props;
	return (
		<Toolbar
			sx={[
				{
					pl: { sm: 2 },
					pr: { xs: 1, sm: 1 },
				},
				numSelected > 0 && {
					bgcolor: (theme) =>
						alpha(
							theme.palette.primary.main,
							theme.palette.action.activatedOpacity
						),
				},
			]}
		>
			{numSelected > 0 ? (
				<h2 className='text-title-medium-strong font-semibold w-full text-left flex justify-start items-center gap-1'>
					Thời khóa biểu{' '}
					<p className='text-body-medium pt-[2px]'>(đã chọn {numSelected})</p>
				</h2>
			) : (
				<h2 className='text-title-medium-strong font-semibold w-full text-left'>
					Thời khóa biểu
				</h2>
			)}
			{numSelected > 0 ? (
				<Tooltip title='Delete'>
					<IconButton color='error'>
						<DeleteIcon color='error' />
					</IconButton>
				</Tooltip>
			) : (
				<Tooltip title='Filter list'>
					<IconButton>
						<FilterListIcon />
					</IconButton>
				</Tooltip>
			)}
		</Toolbar>
	);
}

export default function SMLanding() {
	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] =
		React.useState<keyof ITimetableTableData>('timetableCode');
	const [selected, setSelected] = React.useState<readonly number[]>([]);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	const handleRequestSort = (
		event: React.MouseEvent<unknown>,
		property: keyof ITimetableTableData
	) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			const newSelected = timetableTableData.map((n) => n.id);
			setSelected(newSelected);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
		const selectedIndex = selected.indexOf(id);
		let newSelected: readonly number[] = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}
		setSelected(newSelected);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - timetableTableData.length) : 0;

	const visibleRows = React.useMemo(
		() =>
			[...timetableTableData]
				.sort(getComparator(order, orderBy))
				.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
		[order, orderBy, page, rowsPerPage]
	);

	return (
		<div className='w-[84%] h-screen flex flex-col justify-start items-start'>
			<SMHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>
						Thời khóa biểu
					</h3>
				</div>
			</SMHeader>
			<div className='w-full h-fit flex flex-col justify-center items-center px-[8vw] pt-[5vh]'>
				<Box sx={{ width: '100%' }}>
					<Paper sx={{ width: '100%', mb: 2 }}>
						<EnhancedTableToolbar numSelected={selected.length} />
						<TableContainer>
							<Table
								sx={{ minWidth: 750 }}
								aria-labelledby='tableTitle'
								size='medium'
							>
								<EnhancedTableHead
									numSelected={selected.length}
									order={order}
									orderBy={orderBy}
									onSelectAllClick={handleSelectAllClick}
									onRequestSort={handleRequestSort}
									rowCount={timetableTableData.length}
								/>
								<TableBody>
									{visibleRows.map((row, index) => {
										const isItemSelected = selected.includes(row.id);
										const labelId = `enhanced-table-checkbox-${index}`;

										return (
											<TableRow
												hover
												onClick={(event) =>
													handleClick(event, row.id)
												}
												role='checkbox'
												aria-checked={isItemSelected}
												tabIndex={-1}
												key={row.id}
												selected={isItemSelected}
												sx={{ cursor: 'pointer' }}
											>
												<TableCell padding='checkbox'>
													<Checkbox
														color='primary'
														checked={isItemSelected}
														inputProps={{
															'aria-labelledby': labelId,
														}}
													/>
												</TableCell>
												<TableCell
													component='th'
													id={labelId}
													scope='row'
													padding='none'
													align='center'
												>
													{row.timetableCode}
												</TableCell>
												<TableCell align='left'>
													{row.timetableName}
												</TableCell>
												<TableCell align='center'>
													{row.appliedDate}
												</TableCell>
												<TableCell align='center'>
													{row.endDate}
												</TableCell>
												<TableCell align='center'>
													<h2
														className={`font-semibold ${
															row.fitness > 90
																? 'text-basic-positive'
																: 'text-basic-negative'
														}`}
													>
														{row.fitness}%
													</h2>
												</TableCell>
												<TableCell align='center'>
													<div className='w-full h-full flex justify-center items-center'>
														<div
															className={`w-fit h-fit px-[6%] py-[2%] rounded-[5px] font-semibold 
														${
															row.status === 'Công bố'
																? 'bg-basic-positive-hover text-basic-positive'
																: row.status === 'Vô hiệu'
																? 'bg-basic-negative-hover text-basic-negative'
																: 'bg-basic-gray-hover text-basic-gray'
														}`}
														>
															{row.status}
														</div>
													</div>
												</TableCell>
											</TableRow>
										);
									})}
									{emptyRows > 0 && (
										<TableRow
											style={{
												height: 53 * emptyRows,
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
							count={timetableTableData.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</Paper>
				</Box>
			</div>
		</div>
	);
}

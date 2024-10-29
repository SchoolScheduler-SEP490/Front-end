'use client';

import SMHeader from '@/commons/school_manager/header';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Checkbox, Toolbar, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import Image from 'next/image';
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

function importRecord(props: ILessonTableData): ILessonTableData {
	const {
		id,
		lessonName,
		doubleAvailability,
		mainMinOfDouleSlot,
		mainTotalSlotPerWeek,
		subMinOfDouleSlot,
		subTotalSlotPerWeek,
	} = props;
	return {
		id,
		lessonName,
		doubleAvailability,
		mainMinOfDouleSlot,
		mainTotalSlotPerWeek,
		subMinOfDouleSlot,
		subTotalSlotPerWeek,
	};
}

const subjectGroupTableData: ILessonTableData[] = [
	importRecord({
		id: 1,
		lessonName: 'Toán',
		mainTotalSlotPerWeek: 4,
		mainMinOfDouleSlot: 2,
		subTotalSlotPerWeek: 0,
		subMinOfDouleSlot: 0,
		doubleAvailability: true,
	}),
	importRecord({
		id: 2,
		lessonName: 'Ngữ Văn',
		mainTotalSlotPerWeek: 5,
		mainMinOfDouleSlot: 2,
		subTotalSlotPerWeek: 0,
		subMinOfDouleSlot: 0,
		doubleAvailability: true,
	}),
	importRecord({
		id: 3,
		lessonName: 'Ngoại Ngữ',
		mainTotalSlotPerWeek: 3,
		mainMinOfDouleSlot: 1,
		subTotalSlotPerWeek: 0,
		subMinOfDouleSlot: 0,
		doubleAvailability: false,
	}),
	importRecord({
		id: 4,
		lessonName: 'Vật Lý',
		mainTotalSlotPerWeek: 2,
		mainMinOfDouleSlot: 1,
		subTotalSlotPerWeek: 0,
		subMinOfDouleSlot: 0,
		doubleAvailability: false,
	}),
	importRecord({
		id: 5,
		lessonName: 'Vật Lý',
		mainTotalSlotPerWeek: 2,
		mainMinOfDouleSlot: 1,
		subTotalSlotPerWeek: 0,
		subMinOfDouleSlot: 0,
		doubleAvailability: false,
	}),
	importRecord({
		id: 6,
		lessonName: 'Vật Lý',
		mainTotalSlotPerWeek: 2,
		mainMinOfDouleSlot: 1,
		subTotalSlotPerWeek: 0,
		subMinOfDouleSlot: 0,
		doubleAvailability: false,
	}),
	importRecord({
		id: 7,
		lessonName: 'Vật Lý',
		mainTotalSlotPerWeek: 2,
		mainMinOfDouleSlot: 1,
		subTotalSlotPerWeek: 0,
		subMinOfDouleSlot: 0,
		doubleAvailability: false,
	}),
	importRecord({
		id: 8,
		lessonName: 'Vật Lý',
		mainTotalSlotPerWeek: 2,
		mainMinOfDouleSlot: 1,
		subTotalSlotPerWeek: 0,
		subMinOfDouleSlot: 0,
		doubleAvailability: false,
	}),
	importRecord({
		id: 9,
		lessonName: 'Vật Lý',
		mainTotalSlotPerWeek: 2,
		mainMinOfDouleSlot: 1,
		subTotalSlotPerWeek: 0,
		subMinOfDouleSlot: 0,
		doubleAvailability: false,
	}),
	importRecord({
		id: 10,
		lessonName: 'Vật Lý',
		mainTotalSlotPerWeek: 2,
		mainMinOfDouleSlot: 1,
		subTotalSlotPerWeek: 0,
		subMinOfDouleSlot: 0,
		doubleAvailability: false,
	}),
	importRecord({
		id: 11,
		lessonName: 'Vật Lý',
		mainTotalSlotPerWeek: 2,
		mainMinOfDouleSlot: 1,
		subTotalSlotPerWeek: 0,
		subMinOfDouleSlot: 0,
		doubleAvailability: false,
	}),
	importRecord({
		id: 12,
		lessonName: 'Vật Lý',
		mainTotalSlotPerWeek: 2,
		mainMinOfDouleSlot: 1,
		subTotalSlotPerWeek: 0,
		subMinOfDouleSlot: 0,
		doubleAvailability: false,
	}),
];

const classGroupData: IClassGroupData[] = [
	{
		classGroupName: 'Khối 10',
		classes: ['10A1', '10A2', '10A3', '10A4'],
	},
	{
		classGroupName: 'Khối 11',
		classes: ['11A1', '11A2', '11A3', '11A4'],
	},
	{
		classGroupName: 'Khối 12',
		classes: ['12A1', '12A2', '12A3', '12A4'],
	},
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
	a: { [key in Key]: number | string | boolean },
	b: { [key in Key]: number | string | boolean }
) => number {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
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
		centered: false,
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
		disablePadding: true,
		label: 'Trái buổi',
	},
	{
		id: 'doubleAvailability' as keyof ILessonTableData,
		centered: true,
		disablePadding: false,
		label: 'Xếp tiết kề nhau',
	},
];

// For extrafunction of Table head (filter, sort, etc.)
interface EnhancedTableProps {
	onRequestSort: (
		event: React.MouseEvent<unknown>,
		property: keyof ILessonTableData
	) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}
function EnhancedTableHead(props: EnhancedTableProps) {
	const { order, orderBy, rowCount, onRequestSort } = props;
	const createSortHandler =
		(property: keyof ILessonTableData) => (event: React.MouseEvent<unknown>) => {
			onRequestSort(event, property);
		};

	return (
		<TableHead>
			<TableRow>
				<TableCell
					rowSpan={2}
					align={headCells[0].centered ? 'center' : 'left'}
					padding={headCells[0].disablePadding ? 'none' : 'normal'}
					sortDirection={orderBy === headCells[0].id ? order : false}
					width={50}
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
					<TableSortLabel
						active={orderBy === headCells[0].id}
						direction={orderBy === headCells[0].id ? order : 'asc'}
						onClick={createSortHandler(headCells[0].id)}
					>
						{headCells[0].label}
						{orderBy === headCells[0].id ? (
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
				<TableCell
					rowSpan={2}
					align={headCells[1].centered ? 'center' : 'left'}
					padding={headCells[1].disablePadding ? 'none' : 'normal'}
					sortDirection={orderBy === headCells[1].id ? order : false}
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
					<TableSortLabel
						active={orderBy === headCells[1].id}
						direction={orderBy === headCells[1].id ? order : 'asc'}
						onClick={createSortHandler(headCells[1].id)}
					>
						{headCells[1].label}
						{orderBy === headCells[1].id ? (
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
					Chính khóa (Sáng)
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
					Trái buổi (Chiều)
				</TableCell>
				<TableCell
					rowSpan={2}
					align={headCells[headCells.length - 1].centered ? 'center' : 'left'}
					padding={
						headCells[headCells.length - 1].disablePadding ? 'none' : 'normal'
					}
					sortDirection={
						orderBy === headCells[headCells.length - 1].id ? order : false
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
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell
					align={headCells[3].centered ? 'center' : 'left'}
					padding={headCells[3].disablePadding ? 'none' : 'normal'}
					sortDirection={orderBy === headCells[3].id ? order : false}
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
					<TableSortLabel
						active={orderBy === headCells[3].id}
						direction={orderBy === headCells[3].id ? order : 'asc'}
						onClick={createSortHandler(headCells[3].id)}
					>
						Tổng số tiết mỗi tuần
						{orderBy === headCells[3].id ? (
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

				<TableCell
					align={headCells[4].centered ? 'center' : 'left'}
					padding={headCells[4].disablePadding ? 'none' : 'normal'}
					sortDirection={orderBy === headCells[4].id ? order : false}
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
					<TableSortLabel
						active={orderBy === headCells[4].id}
						direction={orderBy === headCells[4].id ? order : 'asc'}
						onClick={createSortHandler(headCells[4].id)}
					>
						Số tiết cặp tối thiểu
						{orderBy === headCells[4].id ? (
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

				<TableCell
					align={headCells[3].centered ? 'center' : 'left'}
					padding={headCells[3].disablePadding ? 'none' : 'normal'}
					sortDirection={orderBy === headCells[3].id ? order : false}
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
					<TableSortLabel
						active={orderBy === headCells[3].id}
						direction={orderBy === headCells[3].id ? order : 'asc'}
						onClick={createSortHandler(headCells[3].id)}
					>
						Tổng số tiết mỗi tuần
						{orderBy === headCells[3].id ? (
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

				<TableCell
					align={headCells[4].centered ? 'center' : 'left'}
					padding={headCells[4].disablePadding ? 'none' : 'normal'}
					sortDirection={orderBy === headCells[4].id ? order : false}
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
					<TableSortLabel
						active={orderBy === headCells[4].id}
						direction={orderBy === headCells[4].id ? order : 'asc'}
						onClick={createSortHandler(headCells[4].id)}
					>
						Số tiết cặp tối thiểu
						{orderBy === headCells[4].id ? (
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
			</TableRow>
		</TableHead>
	);
}

export default function SMLesson() {
	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState<keyof ILessonTableData>('id');
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	const handleRequestSort = (
		event: React.MouseEvent<unknown>,
		property: keyof ILessonTableData
	) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const emptyRows =
		page > 0
			? Math.max(0, (1 + page) * rowsPerPage - subjectGroupTableData.length)
			: 0;

	const visibleRows = React.useMemo(
		() =>
			[...subjectGroupTableData]
				.sort(getComparator(order, orderBy))
				.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
		[order, orderBy, page, rowsPerPage]
	);

	return (
		<div className='w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar'>
			<SMHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>
						Tiết học
					</h3>
				</div>
			</SMHeader>
			<div className='w-full h-full flex flex-row justify-start items-start'>
				<div className='w-[15%] h-full flex flex-col justify-start items-start border-r-1 border-gray-200'>
					{classGroupData.map((classGroup, index) => (
						<div className='w-full pt-5'>
							<div className='w-full flex justify-between items-center px-5 py-1 my-2 hover:bg-basic-gray-hover'>
								<h3 className='text-body-large-strong text-primary-500'>
									{classGroup.classGroupName}
								</h3>
								<Image
									className='opacity-30'
									src={'/images/icons/drop-arrow.png'}
									alt='drop-arrow'
									unoptimized={true}
									width={13}
									height={13}
								/>
							</div>
							<ul className='w-full flex flex-col gap-2'>
								{classGroup.classes.map((className, index) => (
									<li className='pl-10 py-1 hover:bg-basic-gray-hover'>
										{className}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
				<Box
					sx={{
						width: '85%',
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
								<EnhancedTableHead
									order={order}
									orderBy={orderBy}
									onRequestSort={handleRequestSort}
									rowCount={subjectGroupTableData.length}
								/>
								<TableBody>
									{visibleRows.map((row, index) => {
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
												>
													{row.id}
												</TableCell>
												<TableCell align='left'>
													{row.lessonName}
												</TableCell>
												<TableCell align='center'>
													{row.mainTotalSlotPerWeek ?? '-----'}
												</TableCell>
												<TableCell align='center'>
													{row.mainMinOfDouleSlot ?? '-----'}
												</TableCell>
												<TableCell align='center'>
													{row.subTotalSlotPerWeek ?? '-----'}
												</TableCell>
												<TableCell align='center'>
													{row.subMinOfDouleSlot ?? '-----'}
												</TableCell>
												<TableCell width={100} align='center'>
													<Checkbox
														color='primary'
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
							count={subjectGroupTableData.length}
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

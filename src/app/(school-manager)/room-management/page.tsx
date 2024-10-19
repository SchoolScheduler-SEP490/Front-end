'use client';

import SMHeader from '@/commons/school_manager/header';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Toolbar, Tooltip } from '@mui/material';
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

interface IClassTableData {
	id: number;
	roomName: string;
	buildingName: string;
	availableSubjects: string;
	roomType: string;
	status: string;
}

function importRecord(props: IClassTableData): IClassTableData {
	const { id, roomName, availableSubjects, buildingName, roomType, status } = props;
	return {
		id,
		roomName,
		availableSubjects,
		buildingName,
		roomType,
		status,
	};
}

const classTableData: IClassTableData[] = [
	importRecord({
		id: 1,
		roomName: '101',
		buildingName: 'Tòa A',
		availableSubjects: 'Tất cả môn học',
		roomType: 'Phòng học',
		status: 'Hoạt động',
	}),
	importRecord({
		id: 2,
		roomName: '102',
		buildingName: 'Tòa A',
		availableSubjects: 'Tin học',
		roomType: 'Phòng thực hành',
		status: 'Bảo trì',
	}),
	importRecord({
		id: 3,
		roomName: '307',
		buildingName: 'Tòa B',
		availableSubjects: 'Hóa học - Sinh học',
		roomType: 'Phòng thí nghiệm',
		status: 'Hoạt động',
	}),
	importRecord({
		id: 4,
		roomName: '503',
		buildingName: 'Tòa C',
		availableSubjects: 'Tất cả môn học',
		roomType: 'Phòng học',
		status: 'Hoạt động',
	}),
	importRecord({
		id: 5,
		roomName: '503',
		buildingName: 'Tòa C',
		availableSubjects: 'Tất cả môn học',
		roomType: 'Phòng học',
		status: 'Hoạt động',
	}),
	importRecord({
		id: 6,
		roomName: '503',
		buildingName: 'Tòa C',
		availableSubjects: 'Tất cả môn học',
		roomType: 'Phòng học',
		status: 'Hoạt động',
	}),
	importRecord({
		id: 7,
		roomName: '503',
		buildingName: 'Tòa C',
		availableSubjects: 'Tất cả môn học',
		roomType: 'Phòng học',
		status: 'Bảo trì',
	}),
	importRecord({
		id: 8,
		roomName: '503',
		buildingName: 'Tòa C',
		availableSubjects: 'Tất cả môn học',
		roomType: 'Phòng học',
		status: 'Bảo trì',
	}),
	importRecord({
		id: 9,
		roomName: '503',
		buildingName: 'Tòa C',
		availableSubjects: 'Tất cả môn học',
		roomType: 'Phòng học',
		status: 'Hoạt động',
	}),
	importRecord({
		id: 10,
		roomName: '503',
		buildingName: 'Tòa D',
		availableSubjects: 'Tất cả môn học',
		roomType: 'Phòng học',
		status: 'Hoạt động',
	}),
	importRecord({
		id: 11,
		roomName: '503',
		buildingName: 'Tòa E',
		availableSubjects: 'Tất cả môn học',
		roomType: 'Phòng học',
		status: 'Hoạt động',
	}),
	importRecord({
		id: 12,
		roomName: '503',
		buildingName: 'Tòa C',
		availableSubjects: 'Tất cả môn học',
		roomType: 'Phòng học',
		status: 'Bảo trì',
	}),
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
	id: keyof IClassTableData;
	label: string;
	centered: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id' as keyof IClassTableData,
		centered: true,
		disablePadding: false,
		label: 'STT',
	},
	{
		id: 'roomName' as keyof IClassTableData,
		centered: false,
		disablePadding: true,
		label: 'Tên phòng',
	},
	{
		id: 'buildingName' as keyof IClassTableData,
		centered: true,
		disablePadding: true,
		label: 'Toà nhà',
	},
	{
		id: 'availableSubjects' as keyof IClassTableData,
		centered: false,
		disablePadding: false,
		label: 'Môn học sử dụng',
	},
	{
		id: 'roomType' as keyof IClassTableData,
		centered: false,
		disablePadding: false,
		label: 'Loại phòng',
	},
	{
		id: 'status' as keyof IClassTableData,
		centered: true,
		disablePadding: true,
		label: 'Trạng thái',
	},
];

// For extrafunction of Table head (filter, sort, etc.)
interface EnhancedTableProps {
	onRequestSort: (
		event: React.MouseEvent<unknown>,
		property: keyof IClassTableData
	) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}
function EnhancedTableHead(props: EnhancedTableProps) {
	const { order, orderBy, rowCount, onRequestSort } = props;
	const createSortHandler =
		(property: keyof IClassTableData) => (event: React.MouseEvent<unknown>) => {
			onRequestSort(event, property);
		};

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.centered ? 'center' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sortDirection={orderBy === headCell.id ? order : false}
						sx={[
							{ fontWeight: 'bold' },
							headCell.centered ? { paddingLeft: '2%' } : {},
						]}
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
				<TableCell>
					<h2 className='font-semibold text-white'>CN</h2>
				</TableCell>
			</TableRow>
		</TableHead>
	);
}

export default function SMRoom() {
	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState<keyof IClassTableData>('id');
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	const handleRequestSort = (
		event: React.MouseEvent<unknown>,
		property: keyof IClassTableData
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
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - classTableData.length) : 0;

	const visibleRows = React.useMemo(
		() =>
			[...classTableData]
				.sort(getComparator(order, orderBy))
				.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
		[order, orderBy, page, rowsPerPage]
	);

	return (
		<div className='w-[84%] h-screen flex flex-col justify-start items-start'>
			<SMHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>
						Lớp học
					</h3>
				</div>
			</SMHeader>
			<div className='w-full h-fit flex flex-col justify-center items-center px-[15vw] pt-[5vh]'>
				<Box sx={{ width: '100%' }}>
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
								Lớp học
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
									rowCount={classTableData.length}
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
													{row.roomName}
												</TableCell>
												<TableCell align='center'>
													{row.buildingName}
												</TableCell>
												<TableCell align='left'>
													{row.availableSubjects}
												</TableCell>
												<TableCell align='left'>
													<h2
														className={`font-semibold ${
															row.roomType === 'Phòng học'
																? 'text-primary-400'
																: 'text-tertiary-normal'
														}`}
													>
														{row.roomType}
													</h2>
												</TableCell>
												<TableCell align='center'>
													<div className='w-full h-full flex justify-center items-center'>
														<div
															className={`w-fit h-fit px-[6%] py-[2%] rounded-[5px] font-semibold 
														${
															row.status === 'Hoạt động'
																? 'bg-basic-positive-hover text-basic-positive'
																: 'bg-basic-gray-hover text-basic-gray'
														}`}
														>
															{row.status}
														</div>
													</div>
												</TableCell>
												<TableCell width={80}>
													<IconButton
														color='success'
														sx={{ zIndex: 10 }}
													>
														<Image
															src='/images/icons/menu.png'
															alt='notification-icon'
															unoptimized={true}
															width={20}
															height={20}
														/>
													</IconButton>
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
							count={classTableData.length}
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

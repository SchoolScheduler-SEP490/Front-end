'use client';

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
import { IRoomTableData } from '../../_utils/contants';

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
	id: keyof IRoomTableData;
	label: string;
	centered: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id' as keyof IRoomTableData,
		centered: true,
		disablePadding: false,
		label: 'STT',
	},
	{
		id: 'roomName' as keyof IRoomTableData,
		centered: false,
		disablePadding: true,
		label: 'Tên phòng',
	},
	{
		id: 'buildingName' as keyof IRoomTableData,
		centered: true,
		disablePadding: true,
		label: 'Toà nhà',
	},
	{
		id: 'availableSubjects' as keyof IRoomTableData,
		centered: false,
		disablePadding: false,
		label: 'Môn học sử dụng',
	},
	{
		id: 'roomType' as keyof IRoomTableData,
		centered: false,
		disablePadding: false,
		label: 'Loại phòng',
	},
	{
		id: 'status' as keyof IRoomTableData,
		centered: true,
		disablePadding: true,
		label: 'Trạng thái',
	},
];

// For extrafunction of Table head (filter, sort, etc.)
interface EnhancedTableProps {
	onRequestSort: (
		event: React.MouseEvent<unknown>,
		property: keyof IRoomTableData
	) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}
function EnhancedTableHead(props: EnhancedTableProps) {
	const { order, orderBy, rowCount, onRequestSort } = props;
	const createSortHandler =
		(property: keyof IRoomTableData) => (event: React.MouseEvent<unknown>) => {
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

interface IRoomTableProps {
	roomTableData: IRoomTableData[];
	serverPage: number;
	setServerPage: React.Dispatch<React.SetStateAction<number>>;
	rowsPerPage: number;
	setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
	totalRows?: number;
}

const RoomTable = (props: IRoomTableProps) => {
	const { roomTableData, rowsPerPage, serverPage, setRowsPerPage, setServerPage } =
		props;
	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState<keyof IRoomTableData>('id');
	const [page, setPage] = React.useState<number>(serverPage);
	const [maxCurrentPage, setMaxCurrentPage] = React.useState<number>(serverPage);

	const handleRequestSort = (
		event: React.MouseEvent<unknown>,
		property: keyof IRoomTableData
	) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		if (newPage > page && newPage > maxCurrentPage) {
			setMaxCurrentPage(newPage);
			setServerPage(newPage);
		} else {
			setPage(newPage);
		}
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - roomTableData.length) : 0;

	const visibleRows = React.useMemo(
		() =>
			[...roomTableData]
				.sort(getComparator(order, orderBy))
				.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
		[order, orderBy, page, rowsPerPage]
	);

	return (
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
								rowCount={roomTableData.length}
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
						count={roomTableData.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</Paper>
			</Box>
		</div>
	);
};

export default RoomTable;

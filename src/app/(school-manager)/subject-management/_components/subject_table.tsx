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
import { ISubjectTableData } from '../../_utils/contants';

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
	id: keyof ISubjectTableData;
	label: string;
	centered: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id' as keyof ISubjectTableData,
		centered: true,
		disablePadding: true,
		label: 'STT',
	},
	{
		id: 'subjectName' as keyof ISubjectTableData,
		centered: false,
		disablePadding: false,
		label: 'Tên môn học',
	},
	{
		id: 'subjectCode' as keyof ISubjectTableData,
		centered: true,
		disablePadding: true,
		label: 'Mã môn',
	},
	{
		id: 'subjectGroup' as keyof ISubjectTableData,
		centered: true,
		disablePadding: true,
		label: 'Tổ bộ môn',
	},
	{
		id: 'subjectType' as keyof ISubjectTableData,
		centered: true,
		disablePadding: true,
		label: 'Loại môn học',
	},
];

// For extrafunction of Table head (filter, sort, etc.)
interface EnhancedTableProps {
	onRequestSort: (
		event: React.MouseEvent<unknown>,
		property: keyof ISubjectTableData
	) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}
function EnhancedTableHead(props: EnhancedTableProps) {
	const { order, orderBy, rowCount, onRequestSort } = props;
	const createSortHandler =
		(property: keyof ISubjectTableData) => (event: React.MouseEvent<unknown>) => {
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
							headCell.centered ? { paddingLeft: '3%' } : {},
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

interface ISubjectTableProps {
	subjectTableData: ISubjectTableData[];
	serverPage: number;
	setServerPage: React.Dispatch<React.SetStateAction<number>>;
	rowsPerPage: number;
	setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
	totalRows?: number;
}

const SubjectTable = (props: ISubjectTableProps) => {
	const {
		subjectTableData,
		serverPage,
		rowsPerPage,
		setServerPage,
		setRowsPerPage,
		totalRows,
	} = props;
	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState<keyof ISubjectTableData>('id');
	const [page, setPage] = React.useState<number>(serverPage);
	const [maxCurrentPage, setMaxCurrentPage] = React.useState<number>(serverPage);

	const handleRequestSort = (
		event: React.MouseEvent<unknown>,
		property: keyof ISubjectTableData
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
		setRowsPerPage(0);
	};

	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - subjectTableData.length) : 0;

	const visibleRows = React.useMemo(
		() =>
			[...subjectTableData]
				.sort(getComparator(order, orderBy))
				.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
		[order, orderBy, page, rowsPerPage]
	);
	return (
		<div className='w-full h-fit flex flex-col justify-center items-center px-[10vw] pt-[5vh]'>
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
							Môn học
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
								rowCount={subjectTableData.length}
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
											<TableCell
												align='left'
												sx={{
													maxWidth: '100px` !important',
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
												}}
											>
												{row.subjectName}
											</TableCell>
											<TableCell align='center'>
												{row.subjectCode}
											</TableCell>
											<TableCell align='center'>
												{row.subjectGroup}
											</TableCell>
											<TableCell align='center'>
												<h2
													className={`font-semibold ${
														row.subjectType === 'Bắt buộc'
															? 'text-tertiary-normal'
															: 'text-primary-400'
													}`}
												>
													{row.subjectType}
												</h2>
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
						count={totalRows ?? subjectTableData.length}
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

export default SubjectTable;

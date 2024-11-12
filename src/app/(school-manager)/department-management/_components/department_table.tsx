'use client';
import useNotify from '@/hooks/useNotify';
import { ICommonOption } from '@/utils/constants';
import AddIcon from '@mui/icons-material/Add';
import TuneIcon from '@mui/icons-material/Tune';
import { Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
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
import { ChangeEvent, Dispatch, MouseEvent, SetStateAction, useMemo, useState } from 'react';
import { KeyedMutator } from 'swr';
import { IDepartmentTableData } from '../_libs/constants';
import CreateDepartment from './department_modal_create';
import DeleteDepartmentModal from './department_modal_delete';
import DepartmentHeadAssignmentModal from './department_modal_head_assignment';
import UpdateDepartment from './department_modal_update';

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
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof IDepartmentTableData;
	label: string;
	centered: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id' as keyof IDepartmentTableData,
		centered: false,
		disablePadding: false,
		label: 'STT',
	},
	{
		id: 'departmentName' as keyof IDepartmentTableData,
		centered: false,
		disablePadding: false,
		label: 'Tên tổ bộ môn',
	},
	{
		id: 'departmentCode' as keyof IDepartmentTableData,
		centered: false,
		disablePadding: false,
		label: 'Mã tổ bộ môn',
	},
	{
		id: 'description' as keyof IDepartmentTableData,
		centered: false,
		disablePadding: false,
		label: 'Mô tả',
	},
];

// For extrafunction of Table head (filter, sort, etc.)
interface EnhancedTableProps {
	onRequestSort: (event: MouseEvent<unknown>, property: keyof IDepartmentTableData) => void;
	order: Order;
	orderBy: string;
}
function EnhancedTableHead(props: EnhancedTableProps) {
	const { order, orderBy, onRequestSort } = props;
	const createSortHandler =
		(property: keyof IDepartmentTableData) => (event: MouseEvent<unknown>) => {
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
									sx={[visuallyHidden, { position: 'absolute', zIndex: 10 }]}
								>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
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

interface IDepartmentTableProps {
	departmentData: IDepartmentTableData[];
	page: number;
	setPage: Dispatch<SetStateAction<number>>;
	rowsPerPage: number;
	setRowsPerPage: Dispatch<SetStateAction<number>>;
	totalRows?: number;
	updateTable: KeyedMutator<any>;
	selectedDepartmentId: number;
	setSelectedDepartmentId: Dispatch<SetStateAction<number>>;
	isDepartmentDetailsOpen: boolean;
	setDepartmentDetailsOpen: Dispatch<SetStateAction<boolean>>;
}

const dropdownOptions: ICommonOption[] = [
	{ img: '/images/icons/compose.png', title: 'Chỉnh sửa thông tin' },
	{ img: '/images/icons/delete.png', title: 'Xóa Tổ hợp môn' },
];

const DepartmentTable = (props: IDepartmentTableProps) => {
	const {
		departmentData,
		page,
		setPage,
		rowsPerPage,
		setRowsPerPage,
		totalRows,
		updateTable,
		selectedDepartmentId,
		setDepartmentDetailsOpen,
		isDepartmentDetailsOpen,
		setSelectedDepartmentId,
	} = props;

	const [order, setOrder] = useState<Order>('asc');
	const [orderBy, setOrderBy] = useState<keyof IDepartmentTableData>('id');
	const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
	const [isHeadAssignmentModalOpen, setIsHeadAssignmentModalOpen] = useState<boolean>(false);

	const [selectedRow, setSelectedRow] = useState<IDepartmentTableData>(
		{} as IDepartmentTableData
	);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>, row: IDepartmentTableData) => {
		setAnchorEl((event.target as HTMLElement) ?? null);
		setSelectedRow(row);
	};

	const handleDetailsClick = (departmentId: number) => {
		setSelectedDepartmentId(departmentId);
		if (!isDepartmentDetailsOpen) {
			setDepartmentDetailsOpen(true);
		}
	};

	const handleMenuItemClick = (index: number) => {
		switch (index) {
			case 0:
				setIsUpdateModalOpen(true);
				break;
			case 1:
				setIsDeleteModalOpen(true);
				break;
			default:
				useNotify({
					message: 'Chức năng đang được phát triển',
					type: 'warning',
				});
				break;
		}
		setAnchorEl(null);
	};

	const handleCreateDepartment = () => {
		// Add new department
		setIsCreateModalOpen(true);
	};

	const handleAssignHeadDepartment = () => {
		// Add new department
		setIsHeadAssignmentModalOpen(true);
	};

	const handleRequestSort = (
		event: MouseEvent<unknown>,
		property: keyof IDepartmentTableData
	) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value));
	};

	const emptyRows =
		departmentData.length < rowsPerPage && rowsPerPage < 10
			? rowsPerPage - departmentData.length
			: 0;

	const visibleRows = useMemo(
		() => [...departmentData].sort(getComparator(order, orderBy)),
		[order, orderBy, page, rowsPerPage, departmentData]
	);

	return (
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
						Tổ bộ môn
					</h2>
					<div className='w-fit h-fit flex flex-row justify-center items-center'>
						<Tooltip title='Thêm Tổ bộ môn'>
							<IconButton onClick={handleCreateDepartment}>
								<AddIcon />
							</IconButton>
						</Tooltip>
						<Tooltip title='Phân công tổ trưởng'>
							<IconButton onClick={handleAssignHeadDepartment}>
								<TuneIcon />
							</IconButton>
						</Tooltip>
					</div>
				</Toolbar>
				<TableContainer>
					<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size='medium'>
						<EnhancedTableHead
							order={order}
							orderBy={orderBy}
							onRequestSort={handleRequestSort}
						/>
						<TableBody>
							{visibleRows.length === 0 && (
								<TableRow>
									<TableCell colSpan={6} align='center'>
										<h1 className='text-body-large-strong italic text-basic-gray'>
											Tổ bộ môn chưa có dữ liệu
										</h1>
									</TableCell>
								</TableRow>
							)}
							{visibleRows.map((row, index) => {
								const labelId = `enhanced-table-checkbox-${index}`;

								return (
									<TableRow
										hover
										role='checkbox'
										tabIndex={-1}
										key={row.id}
										sx={[
											{ userSelect: 'none' },
											selectedDepartmentId === row.departmentKey &&
												isDepartmentDetailsOpen && {
													backgroundColor: '#f5f5f5',
												},
										]}
									>
										<TableCell
											component='th'
											id={labelId}
											scope='row'
											padding='normal'
											align='left'
										>
											{index + 1 + page * rowsPerPage}
										</TableCell>
										<TableCell
											align='left'
											width={300}
											sx={{
												whiteSpace: 'nowrap',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												cursor: 'pointer',
											}}
											onClick={() => handleDetailsClick(row.departmentKey)}
										>
											<Typography noWrap width={200} fontSize={15}>
												{row.departmentName}
											</Typography>
										</TableCell>
										<TableCell align='left'>
											{row.departmentCode ? row.departmentCode : '- - - - -'}
										</TableCell>
										<TableCell align='left' width={200}>
											<Typography noWrap width={200} fontSize={15}>
												{row.description.length > 0
													? row.description
													: '- - - - -'}
											</Typography>
										</TableCell>
										<TableCell width={80}>
											<IconButton
												color='success'
												sx={{ zIndex: 10 }}
												id={`basic-button${row.departmentCode + index}`}
												aria-controls={
													open ? `basic-menu${index}` : undefined
												}
												aria-haspopup='true'
												aria-expanded={open ? 'true' : undefined}
												onClick={(event) => handleClick(event, row)}
											>
												<Image
													src='/images/icons/menu.png'
													alt='notification-icon'
													unoptimized={true}
													width={20}
													height={20}
												/>
											</IconButton>
											<Menu
												id={row.departmentCode + 'menu' + index}
												anchorEl={anchorEl}
												elevation={1}
												open={open}
												onClose={() => setAnchorEl(null)}
												MenuListProps={{
													'aria-labelledby': `${
														row.departmentCode + 'menu' + index
													}`,
												}}
											>
												{dropdownOptions.map((option, i) => (
													<MenuItem
														key={option.title + i}
														onClick={() => handleMenuItemClick(i)}
														className={`flex flex-row items-center ${
															i === dropdownOptions.length - 1 &&
															'hover:bg-basic-negative-hover hover:text-basic-negative'
														}`}
													>
														<Image
															className='mr-4'
															src={option.img}
															alt={option.title}
															width={15}
															height={15}
														/>
														<h2 className='text-body-medium'>
															{option.title}
														</h2>
													</MenuItem>
												))}
											</Menu>
										</TableCell>
									</TableRow>
								);
							})}
							{emptyRows > 0 && (
								<TableRow
									style={{
										height: 50 * emptyRows,
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
					labelRowsPerPage='Số hàng'
					labelDisplayedRows={({ from, to, count }) =>
						`${from} - ${to} của ${count !== -1 ? count : `hơn ${to}`}`
					}
					count={totalRows ?? departmentData.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
			<CreateDepartment
				open={isCreateModalOpen}
				setOpen={setIsCreateModalOpen}
				updateDepartment={updateTable}
			/>
			<UpdateDepartment
				departmentData={selectedRow}
				open={isUpdateModalOpen}
				setOpen={setIsUpdateModalOpen}
				updateDepartment={updateTable}
			/>
			<DeleteDepartmentModal
				open={isDeleteModalOpen}
				setOpen={setIsDeleteModalOpen}
				departmentId={selectedRow.departmentKey}
				departmentName={selectedRow.departmentName}
				mutate={updateTable}
			/>
			<DepartmentHeadAssignmentModal
				departmentData={departmentData}
				open={isHeadAssignmentModalOpen}
				setOpen={setIsHeadAssignmentModalOpen}
				updateDepartment={updateTable}
			/>
		</Box>
	);
};

export default DepartmentTable;

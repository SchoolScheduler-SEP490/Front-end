'use client';
import {
	Chip,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Toolbar,
	Tooltip,
} from '@mui/material';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styles from '../_styles/table_styles.module.css';
import { IAccountResponse } from '../_libs/constants';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { ACCOUNT_STATUS } from '../../_utils/constants';
import FilterListIcon from '@mui/icons-material/FilterList';

interface IAccountTableProps {
	data: IAccountResponse[];
	page: number;
	setPage: Dispatch<SetStateAction<number>>;
	rowsPerPage: number;
	setRowsPerPage: Dispatch<SetStateAction<number>>;
	totalRows?: number;
	selectedAccountStatus: string;
	setIsFilterableModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AccountsTable = (props: IAccountTableProps) => {
	const {
		data,
		page,
		rowsPerPage,
		setPage,
		setRowsPerPage,
		totalRows,
		selectedAccountStatus,
		setIsFilterableModalOpen,
	} = props;

	const [visibleRows, setVisibleRows] = useState<IAccountResponse[]>([]);
	const previousData = useRef<IAccountResponse[]>([]);

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
	};

	const handleFilterable = () => {
		setIsFilterableModalOpen((prev) => !prev);
	};

	// Theo dõi thay đổi của data và chỉ thêm phần tử mới
	useEffect(() => {
		const newData = data.filter(
			(item) => !previousData.current.some((prevItem) => prevItem.id === item.id)
		);
		if (newData.length > 0) {
			setVisibleRows((prevVisibleRows) => [...newData, ...prevVisibleRows]);
			previousData.current = data;
		}
	}, [data]);

	// Hiển thị các hàng phù hợp với trang hiện tại
	const paginatedRows = useMemo(
		() =>
			visibleRows
				.filter((item) => item.status === selectedAccountStatus || selectedAccountStatus === 'All')
				.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
		[page, rowsPerPage, visibleRows, selectedAccountStatus]
	);

	const emptyRows = paginatedRows.length < rowsPerPage ? rowsPerPage - paginatedRows.length : 0;

	return (
		<Paper>
			<Toolbar
				sx={[
					{
						pl: { sm: 2 },
						pr: { xs: 1, sm: 1 },
						width: '100%',
						height: 30,
						py: 0,
					},
				]}
			>
				<h2 className='text-title-medium-strong font-semibold w-full text-left'>
					Danh sách tài khoản
				</h2>
				<Tooltip title='Lọc danh sách'>
					<IconButton onClick={handleFilterable}>
						<FilterListIcon />
					</IconButton>
				</Tooltip>
			</Toolbar>
			<TableContainer sx={{ overflow: 'hidden' }}>
				<Table size='small'>
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeight: 'bold' }}>STT</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Tên trường</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Số điện thoại</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TransitionGroup component={null}>
							{paginatedRows.map((account: IAccountResponse, index: number) => (
								<CSSTransition
									key={account.id}
									timeout={500}
									classNames={{
										enter: styles.rowEnter,
										enterActive: styles.rowEnterActive,
										exit: styles.rowExit,
										exitActive: styles.rowExitActive,
									}}
								>
									<TableRow>
										<TableCell>{index + 1}</TableCell>
										<TableCell>{account['school-name']}</TableCell>
										<TableCell>{account.email}</TableCell>
										<TableCell>{account.phone}</TableCell>
										<TableCell>
											<Chip
												label={ACCOUNT_STATUS[account.status]}
												variant='outlined'
												color={
													account.status === 'Active'
														? 'success'
														: account.status === 'Pending'
														? 'warning'
														: 'info'
												}
											/>
										</TableCell>
									</TableRow>
								</CSSTransition>
							))}
						</TransitionGroup>
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
				count={totalRows ?? visibleRows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
};

export default AccountsTable;

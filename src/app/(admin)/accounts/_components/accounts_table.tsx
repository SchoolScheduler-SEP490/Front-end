'use client';
import { useAppContext } from '@/context/app_provider';
import useNotify from '@/hooks/useNotify';
import { TRANSLATOR } from '@/utils/dictionary';
import BlockIcon from '@mui/icons-material/Block';
import FilterListIcon from '@mui/icons-material/FilterList';
import LoopIcon from '@mui/icons-material/Loop';
import RuleIcon from '@mui/icons-material/Rule';
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
import { ChangeEvent, Dispatch, SetStateAction, useMemo, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { KeyedMutator } from 'swr';
import { ACCOUNT_STATUS } from '../../_utils/constants';
import { getActiveSchoolApi, getUpdateStatusSchoolApi } from '../_libs/apis';
import { IAccountResponse, IUpdateAccountRequest } from '../_libs/constants';
import styles from '../_styles/table_styles.module.css';
import AccountActiveModal from './accounts_modal_active';
import AccountInactiveModal from './accounts_modal_inactive';
import AccountRequestModal from './accounts_modal_requests';

interface IAccountTableProps {
	data: IAccountResponse[];
	page: number;
	setPage: Dispatch<SetStateAction<number>>;
	rowsPerPage: number;
	setRowsPerPage: Dispatch<SetStateAction<number>>;
	totalRows?: number;
	selectedAccountStatus: string;
	setIsFilterableModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	updateData: KeyedMutator<any>;
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
		updateData,
	} = props;
	const { sessionToken } = useAppContext();

	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
	const [isInactiveModalOpen, setIsInactiveModalOpen] = useState<boolean>(false);
	const [isActiveModalOpen, setIsActiveModalOpen] = useState<boolean>(false);

	const [selectedAccount, setSelectedAccount] = useState<IAccountResponse>({} as IAccountResponse);

	const handleProcessAccount = async (newStatus: 'Active' | 'Pending' | 'Inactive') => {
		const formProcessApi = getActiveSchoolApi({
			schoolId: selectedAccount['school-id'],
			accountStatus: newStatus,
			schoolManagerId: selectedAccount.id,
		});
		const response = await fetch(formProcessApi, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${sessionToken}`,
			},
		});

		if (response.ok) {
			const data = await response.json();
			updateData();
			useNotify({
				message: TRANSLATOR[data.message] ?? data.message ?? 'Thao tác thành công',
				type: 'success',
			});
		} else {
			const data = await response.json();
			updateData();
			useNotify({
				message: TRANSLATOR[data.message] ?? data.message ?? 'Thao tác thất bại',
				type: 'error',
			});
		}
	};

	const handleUpdateAccount = async (newStatus: 'Active' | 'Pending' | 'Inactive') => {
		const formProcessApi = getUpdateStatusSchoolApi();
		const formData: IUpdateAccountRequest = {
			'account-id': selectedAccount.id,
			'account-status': newStatus,
		};

		const response = await fetch(formProcessApi, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${sessionToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		});

		if (response.ok) {
			const data = await response.json();
			updateData();
			useNotify({
				message: TRANSLATOR[data.message] ?? data.message ?? 'Thao tác thành công',
				type: 'success',
			});
		} else {
			const data = await response.json();
			updateData();
			useNotify({
				message: TRANSLATOR[data.message] ?? data.message ?? 'Thao tác thất bại',
				type: 'error',
			});
		}
	};

	const handleProcessPendingAccount = async (newStatus: 'Active' | 'Pending' | 'Inactive') => {
		await handleProcessAccount(newStatus);
		setIsConfirmModalOpen(false);
	};

	const handleInactiveAccount = async () => {
		await handleUpdateAccount('Inactive');
		setIsInactiveModalOpen(false);
	};

	const handleActiveAccount = async () => {
		await handleUpdateAccount('Active');
		setIsActiveModalOpen(false);
	};

	const handleSelectPendingAccount = (account: IAccountResponse) => {
		setSelectedAccount(account);
		setIsConfirmModalOpen(true);
	};

	const handleSelectActiveAccount = (account: IAccountResponse) => {
		setSelectedAccount(account);
		setIsInactiveModalOpen(true);
	};

	const handleSelectInactiveAccount = (account: IAccountResponse) => {
		setSelectedAccount(account);
		setIsActiveModalOpen(true);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
	};

	const handleFilterable = () => {
		setIsFilterableModalOpen((prev) => !prev);
	};

	const visibleRows = useMemo(() => [...data], [page, rowsPerPage, data]);
	const emptyRows = rowsPerPage - Math.min(rowsPerPage, Math.abs(data.length - page) * rowsPerPage);

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
							<TableCell sx={{ fontWeight: 'bold' }}></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TransitionGroup component={null}>
							{visibleRows.map((account: IAccountResponse, index: number) => (
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
										<TableCell width={100} sx={{ textAlign: 'center' }}>
											<Chip
												label={ACCOUNT_STATUS[account.status]}
												variant='outlined'
												color={
													account.status === 'Active'
														? 'success'
														: account.status === 'Pending'
														? 'warning'
														: 'default'
												}
											/>
										</TableCell>
										<TableCell width={50}>
											{account.status === 'Pending' && (
												<IconButton onClick={() => handleSelectPendingAccount(account)}>
													<RuleIcon />
												</IconButton>
											)}
											{account.status === 'Active' && (
												<IconButton
													color='error'
													onClick={() => handleSelectActiveAccount(account)}
												>
													<BlockIcon fontSize='small' />
												</IconButton>
											)}
											{account.status === 'Inactive' && (
												<IconButton
													color='success'
													onClick={() => handleSelectInactiveAccount(account)}
												>
													<LoopIcon />
												</IconButton>
											)}
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
				count={totalRows ?? data.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
			<AccountRequestModal
				open={isConfirmModalOpen}
				setOpen={setIsConfirmModalOpen}
				selectedAccount={selectedAccount}
				handleProcess={handleProcessPendingAccount}
			/>
			<AccountInactiveModal
				open={isInactiveModalOpen}
				setOpen={setIsInactiveModalOpen}
				handleConfirm={handleInactiveAccount}
				selectedAccountName={selectedAccount['school-name']}
			/>

			<AccountActiveModal
				open={isActiveModalOpen}
				setOpen={setIsActiveModalOpen}
				handleConfirm={handleActiveAccount}
				selectedAccountName={selectedAccount['school-name']}
			/>
		</Paper>
	);
};

export default AccountsTable;

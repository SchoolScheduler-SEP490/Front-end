import { ISchoolYearResponse } from '@/utils/constants';
import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IosShareIcon from '@mui/icons-material/IosShare';
import {
	Chip,
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
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
	Typography,
} from '@mui/material';
import { ChangeEvent, Dispatch, SetStateAction, useMemo, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styles from '../_styles/table_styles.module.css';
import { getUpdateSchoolYearStatusApi } from '../_libs/apis';
import { useAppContext } from '@/context/app_provider';
import useNotify from '@/hooks/useNotify';
import PublishConfirmModal from './schoolyears_modal_confirm';
import RevokeConfirmModal from './schoolyears_modal_revoke';
import SchoolYearUpdateModal from './schoolyears_modal_update';
import { KeyedMutator } from 'swr';

interface ISchoolYearTableProps {
	data: ISchoolYearResponse[];
	page: number;
	setPage: Dispatch<SetStateAction<number>>;
	rowsPerPage: number;
	setRowsPerPage: Dispatch<SetStateAction<number>>;
	totalRows?: number;
	setIsFilterableModalOpen: Dispatch<SetStateAction<boolean>>;
	updateData: KeyedMutator<any>;
}

const SchoolYearTable = (props: ISchoolYearTableProps) => {
	const {
		data,
		page,
		rowsPerPage,
		setPage,
		setRowsPerPage,
		totalRows,
		setIsFilterableModalOpen,
		updateData,
	} = props;
	const { sessionToken } = useAppContext();

	const visibleRows = useMemo(() => [...data], [page, rowsPerPage, data]);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const [selectedSchoolYear, setSelectedSchoolYear] = useState<ISchoolYearResponse | null>(null);

	const [isConfirmPublishModalOpen, setIsConfirmPublishModalOpen] = useState<boolean>(false);
	const [isConfirmRevokeModalOpen, setIsConfirmRevokeModalOpen] = useState<boolean>(false);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

	const handleMenuOpen = (
		event: React.MouseEvent<HTMLElement>,
		schoolYear: ISchoolYearResponse
	) => {
		setAnchorEl(event.currentTarget);
		setSelectedSchoolYear(schoolYear);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleUpdateSchoolYearStatus = async (newStatus: boolean) => {
		const endpoint = getUpdateSchoolYearStatusApi(selectedSchoolYear?.id ?? 0, newStatus);
		const response = await fetch(endpoint, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${sessionToken}`,
			},
		});
		if (response.ok) {
			const data = await response.json();
			useNotify({
				message: data.message ?? 'Cập nhật trạng thái năm học thành công',
				type: 'success',
			});
		}
	};

	const handleOptionClick = (featureIndex: number) => {
		switch (featureIndex) {
			case 1:
				setIsConfirmPublishModalOpen(true);
				break;
			case 2:
				setIsUpdateModalOpen(true);
				break;
			case 3:
				setIsConfirmRevokeModalOpen(true);
				break;
			default:
				break;
		}
		handleMenuClose();
	};

	const handlePublishSchoolYear = async () => {
		await handleUpdateSchoolYearStatus(true);
		updateData();
		setIsConfirmPublishModalOpen(false);
	};

	const handleRevokeSchoolYear = async () => {
		await handleUpdateSchoolYearStatus(false);
		updateData();
		setIsConfirmRevokeModalOpen(false);
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

	return (
		<Paper sx={{ width: '100%' }}>
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
					Danh sách năm học
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
							<TableCell sx={{ fontWeight: 'bold' }}>Mã năm học</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Năm bắt đầu</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Năm kết thúc</TableCell>
							<TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Phân loại</TableCell>
							<TableCell width={50}></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TransitionGroup component={null}>
							{visibleRows.map((school: ISchoolYearResponse, index: number) => (
								<CSSTransition
									key={school.id}
									timeout={500}
									classNames={{
										enter: styles.rowEnter,
										enterActive: styles.rowEnterActive,
										exit: styles.rowExit,
										exitActive: styles.rowExitActive,
									}}
								>
									<TableRow>
										<TableCell>{index + page * 10 + 1}</TableCell>
										<TableCell>
											<Typography
												sx={{
													overflow: 'hidden',
													textOverflow: 'ellipsis',
													whiteSpace: 'nowrap',
													fontSize: 14,
												}}
											>
												{school['school-year-code']}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography
												sx={{
													overflow: 'hidden',
													textOverflow: 'ellipsis',
													whiteSpace: 'nowrap',
													fontSize: 14,
												}}
											>
												{school['start-year']}
											</Typography>
										</TableCell>
										<TableCell>{school['end-year']}</TableCell>
										<TableCell width={50} sx={{ textAlign: 'center' }}>
											<Chip
												label={school['is-public'] ? 'Công khai' : 'Nội bộ'}
												variant='outlined'
												color={school['is-public'] ? 'success' : 'warning'}
											/>
										</TableCell>
										<TableCell width={50}>
											<IconButton
												sx={{ zIndex: 10 }}
												onClick={(event) => handleMenuOpen(event, school)}
											>
												<MoreVertIcon fontSize='small' />
											</IconButton>
											<Menu
												anchorEl={anchorEl}
												open={open}
												onClose={handleMenuClose}
												anchorOrigin={{
													vertical: 'bottom',
													horizontal: 'right',
												}}
												transformOrigin={{
													vertical: 'top',
													horizontal: 'right',
												}}
											>
												<MenuItem
													onClick={() => handleOptionClick(1)}
													disabled={selectedSchoolYear?.['is-public']}
												>
													<ListItemIcon>
														<IosShareIcon
															fontSize='small'
															color='inherit'
															sx={{ color: '#1a659e' }}
														/>
													</ListItemIcon>
													<ListItemText primary='Công bố năm học' />
												</MenuItem>
												<MenuItem
													onClick={() => handleOptionClick(2)}
													disabled={selectedSchoolYear?.['is-public']}
												>
													<ListItemIcon>
														<EditIcon fontSize='small' />
													</ListItemIcon>
													<ListItemText primary='Cập nhật thông tin' />
												</MenuItem>
												<MenuItem
													onClick={() => handleOptionClick(3)}
													disabled={!selectedSchoolYear?.['is-public']}
													sx={{ ':hover': { bgcolor: 'rgba(245, 75, 75, .2)' } }}
												>
													<ListItemIcon>
														<BlockIcon fontSize='small' color='error' />
													</ListItemIcon>
													<ListItemText primary='Thu hồi năm học' />
												</MenuItem>
											</Menu>
										</TableCell>
									</TableRow>
								</CSSTransition>
							))}
						</TransitionGroup>
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
			<PublishConfirmModal
				open={isConfirmPublishModalOpen}
				setOpen={setIsConfirmPublishModalOpen}
				handleConfirm={handlePublishSchoolYear}
			/>
			<RevokeConfirmModal
				open={isConfirmRevokeModalOpen}
				setOpen={setIsConfirmRevokeModalOpen}
				handleConfirm={handleRevokeSchoolYear}
			/>
			<SchoolYearUpdateModal
				open={isUpdateModalOpen}
				setOpen={setIsUpdateModalOpen}
				selectedSchoolYear={selectedSchoolYear ?? ({} as ISchoolYearResponse)}
				yearData={data}
				updateData={updateData}
			/>
		</Paper>
	);
};

export default SchoolYearTable;

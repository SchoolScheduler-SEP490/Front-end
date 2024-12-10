'use client';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
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
	Typography,
} from '@mui/material';
import { ChangeEvent, Dispatch, SetStateAction, useMemo, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { KeyedMutator } from 'swr';
import { SCHOOL_STATUS } from '../../_utils/constants';
import { ISchoolResponse } from '../_libs/constants';
import styles from '../_styles/table_styles.module.css';

const SCHOOL_STATUS_COLOR: { [key: string]: string } = {
	Validating: 'warning',
	Pending: 'default',
	Active: 'success',
	Inactive: 'error',
};

interface IAccountTableProps {
	data: ISchoolResponse[];
	page: number;
	setPage: Dispatch<SetStateAction<number>>;
	rowsPerPage: number;
	setRowsPerPage: Dispatch<SetStateAction<number>>;
	totalRows?: number;
	setIsFilterableModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	mutate: KeyedMutator<any>;
}

const SchoolsTable = (props: IAccountTableProps) => {
	const {
		data,
		page,
		rowsPerPage,
		setPage,
		setRowsPerPage,
		totalRows,
		setIsFilterableModalOpen,
		mutate,
	} = props;

	const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

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
					Danh sách trường học
				</h2>
				<Tooltip title='Thêm trường học'>
					<IconButton onClick={() => setIsCreateModalOpen(true)}>
						<AddIcon />
					</IconButton>
				</Tooltip>
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
							<TableCell sx={{ fontWeight: 'bold' }}>Địa chỉ</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Tên tỉnh</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TransitionGroup component={null}>
							{visibleRows.map((school: ISchoolResponse, index: number) => (
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
												{school.name}
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
												{school.address}
											</Typography>
										</TableCell>
										<TableCell>{school['province-name']}</TableCell>
										<TableCell sx={{ textAlign: 'center' }}>
											<Chip
												label={SCHOOL_STATUS[school.status]}
												variant='outlined'
												color={(SCHOOL_STATUS_COLOR[school.status] as any) ?? 'info'}
											/>
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
			{/* <CreateSchoolModal
				open={isCreateModalOpen}
				setOpen={setIsCreateModalOpen}
				mutate={mutate}
			/> */}
		</Paper>
	);
};

export default SchoolsTable;

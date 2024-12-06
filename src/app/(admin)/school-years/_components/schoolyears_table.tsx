import { ISchoolYearResponse } from '@/utils/constants';
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
import { ChangeEvent, Dispatch, SetStateAction, useMemo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styles from '../_styles/table_styles.module.css';

interface ISchoolYearTableProps {
	data: ISchoolYearResponse[];
	page: number;
	setPage: Dispatch<SetStateAction<number>>;
	rowsPerPage: number;
	setRowsPerPage: Dispatch<SetStateAction<number>>;
	totalRows?: number;
	setIsFilterableModalOpen: Dispatch<SetStateAction<boolean>>;
}

const SchoolYearTable = (props: ISchoolYearTableProps) => {
	const { data, page, rowsPerPage, setPage, setRowsPerPage, totalRows, setIsFilterableModalOpen } =
		props;

	const visibleRows = useMemo(() => [...data], [page, rowsPerPage, data]);

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
							<TableCell sx={{ fontWeight: 'bold' }}>Phân loại</TableCell>
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
										<TableCell>
											<Chip
												label={school['is-public'] ? 'Công khai' : 'Nội bộ'}
												variant='outlined'
												color={school['is-public'] ? 'success' : 'warning'}
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
		</Paper>
	);
};

export default SchoolYearTable;

import FilterListIcon from '@mui/icons-material/FilterList';
import {
	Chip,
	IconButton,
	Paper,
	Skeleton,
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

const SchoolYearTableSkeleton = () => {
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
					Danh sách tài khoản
				</h2>
				<Tooltip title='Lọc danh sách'>
					<IconButton>
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
						{[1, 2, 3, 4, 5].map((index: number) => (
							<TableRow key={index}>
								<TableCell>
									<Skeleton variant='text' animation='wave' sx={{ width: '50%' }} />
								</TableCell>
								<TableCell>
									<Skeleton variant='text' animation='wave' sx={{ width: '100%' }} />
								</TableCell>
								<TableCell>
									<Skeleton variant='text' animation='wave' sx={{ width: '100%' }} />
								</TableCell>
								<TableCell>
									<Skeleton variant='text' animation='wave' sx={{ width: '100%' }} />
								</TableCell>
								<TableCell>
									<Chip label={'Đang tải...'} variant='outlined' color={'default'} />
								</TableCell>
							</TableRow>
						))}
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
				count={10}
				rowsPerPage={10}
				page={1}
				onPageChange={() => {}}
				onRowsPerPageChange={() => {}}
			/>
		</Paper>
	);
};

export default SchoolYearTableSkeleton;

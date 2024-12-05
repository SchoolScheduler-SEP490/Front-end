import {
	Paper,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
} from '@mui/material';
import { TransitionGroup } from 'react-transition-group';

const AccountTableSkeleton = () => {
	return (
		<Paper>
			<TableContainer sx={{ overflow: 'hidden' }}>
				<Table size='small'>
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeight: 'bold' }}>STT</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Tên người dùng</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Số điện thoại</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TransitionGroup component={null}>
							{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index: number) => (
								<TableRow>
									<TableCell>{index + 1}</TableCell>
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
										<Skeleton variant='text' animation='wave' sx={{ width: '100%' }} />
									</TableCell>
								</TableRow>
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
				count={10}
				rowsPerPage={10}
				page={1}
				onPageChange={() => {}}
				onRowsPerPageChange={() => {}}
			/>
		</Paper>
	);
};

export default AccountTableSkeleton;

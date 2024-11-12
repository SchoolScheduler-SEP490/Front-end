import AddIcon from '@mui/icons-material/Add';
import TuneIcon from '@mui/icons-material/Tune';
import { Skeleton, Toolbar, Tooltip } from '@mui/material';
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
import { MouseEvent } from 'react';
import { IDepartmentTableData } from '../_libs/constants';

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

type Order = 'asc' | 'desc';

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

const DepartmentTableSkeleton = () => {
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
							<IconButton>
								<AddIcon />
							</IconButton>
						</Tooltip>
						<Tooltip title='Lọc danh sách'>
							<IconButton>
								<TuneIcon />
							</IconButton>
						</Tooltip>
					</div>
				</Toolbar>
				<TableContainer>
					<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size='medium'>
						<EnhancedTableHead order={'asc'} orderBy={'id'} onRequestSort={() => {}} />
						<TableBody>
							{[1, 2, 3, 4, 5].map((row, index) => {
								const labelId = `enhanced-table-checkbox-${index}`;

								return (
									<TableRow hover role='checkbox' tabIndex={-1} key={row + index}>
										<TableCell
											component='th'
											id={labelId}
											scope='row'
											padding='normal'
											align='left'
										>
											<Skeleton
												className='w-full'
												animation='wave'
												variant='text'
											/>
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
										>
											<Skeleton
												className='w-full'
												animation='wave'
												variant='text'
											/>
										</TableCell>
										<TableCell align='left'>
											<Skeleton
												className='w-full'
												animation='wave'
												variant='text'
											/>
										</TableCell>
										<TableCell align='left' width={200}>
											<Skeleton
												className='w-full'
												animation='wave'
												variant='text'
											/>
										</TableCell>
										<TableCell width={80}>
											<IconButton color='success' sx={{ zIndex: 10 }}>
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
					count={15}
					rowsPerPage={5}
					page={1}
					onPageChange={() => {}}
					onRowsPerPageChange={() => {}}
				/>
			</Paper>
		</Box>
	);
};

export default DepartmentTableSkeleton;

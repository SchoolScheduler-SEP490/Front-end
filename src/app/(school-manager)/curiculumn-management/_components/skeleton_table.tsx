'use client';

import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
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
import * as React from 'react';
import { ICurriculumTableData } from '../_libs/constants';

type Order = 'asc' | 'desc';

interface HeadCell {
	disablePadding: boolean;
	id: keyof ICurriculumTableData;
	label: string;
	centered: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id' as keyof ICurriculumTableData,
		centered: false,
		disablePadding: false,
		label: 'STT',
	},
	{
		id: 'subjectGroupName' as keyof ICurriculumTableData,
		centered: false,
		disablePadding: false,
		label: 'Tên Khung chương trình',
	},
	{
		id: 'subjectGroupCode' as keyof ICurriculumTableData,
		centered: false,
		disablePadding: false,
		label: 'Mã Khung chương trình',
	},
	{
		id: 'grade' as keyof ICurriculumTableData,
		centered: false,
		disablePadding: false,
		label: 'Khối áp dụng',
	},
];

// For extrafunction of Table head (filter, sort, etc.)
interface EnhancedTableProps {
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof ICurriculumTableData) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}
function EnhancedTableHead(props: EnhancedTableProps) {
	const { order, orderBy, rowCount, onRequestSort } = props;
	const createSortHandler =
		(property: keyof ICurriculumTableData) => (event: React.MouseEvent<unknown>) => {
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
						sx={[{ fontWeight: 'bold' }, headCell.centered ? { paddingLeft: '3%' } : {}]}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component='span' sx={[visuallyHidden, { position: 'absolute', zIndex: 10 }]}>
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

const CurriculumTableSkeleton = () => {
	return (
		<div className='w-full h-fit flex flex-row justify-center items-center gap-6 px-1 pt-[2vh]'>
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
							Khung chương trình
						</h2>
						<div className='w-fit h-fit flex flex-row justify-center items-center'>
							<Tooltip title='Thêm Môn học'>
								<IconButton>
									<AddIcon />
								</IconButton>
							</Tooltip>
							<Tooltip title='Lọc danh sách'>
								<IconButton>
									<FilterListIcon />
								</IconButton>
							</Tooltip>
						</div>
					</Toolbar>
					<TableContainer>
						<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size='medium'>
							<EnhancedTableHead
								order={'asc'}
								orderBy={'id'}
								onRequestSort={() => {}}
								rowCount={15}
							/>
							<TableBody>
								{[1, 2, 3, 4, 5].map((row, index) => {
									return (
										<TableRow hover role='checkbox' tabIndex={-1} key={row}>
											<TableCell component='th' scope='row' padding='normal' align='left'>
												<Skeleton animation='wave' variant='text' />{' '}
											</TableCell>
											<TableCell align='left'>
												<Skeleton animation='wave' variant='text' />
											</TableCell>
											<TableCell align='left'>
												<Skeleton animation='wave' variant='text' />
											</TableCell>
											<TableCell align='left' width={200} className='!font-semibold'>
												<Skeleton animation='wave' variant='text' />
											</TableCell>
											<TableCell width={80}>
												<IconButton color='error' sx={{ zIndex: 10 }}>
													<Image
														src='/images/icons/delete.png'
														alt='Xóa tổ bộ môn'
														width={15}
														height={15}
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
		</div>
	);
};

export default CurriculumTableSkeleton;

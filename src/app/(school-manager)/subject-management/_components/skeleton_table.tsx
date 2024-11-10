'use client';

import { Skeleton, Toolbar } from '@mui/material';
import Box from '@mui/material/Box';
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
import * as React from 'react';
import { ISubjectTableData } from '../_libs/constants';

type Order = 'asc' | 'desc';

interface HeadCell {
	disablePadding: boolean;
	id: keyof ISubjectTableData;
	label: string;
	centered: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id' as keyof ISubjectTableData,
		centered: false,
		disablePadding: false,
		label: 'STT',
	},
	{
		id: 'subjectName' as keyof ISubjectTableData,
		centered: false,
		disablePadding: false,
		label: 'Tên môn học',
	},
	{
		id: 'subjectCode' as keyof ISubjectTableData,
		centered: false,
		disablePadding: false,
		label: 'Mã môn',
	},
	{
		id: 'subjectGroup' as keyof ISubjectTableData,
		centered: false,
		disablePadding: false,
		label: 'Tổ bộ môn',
	},
	{
		id: 'subjectType' as keyof ISubjectTableData,
		centered: true,
		disablePadding: true,
		label: 'Loại môn học',
	},
];

// For extrafunction of Table head (filter, sort, etc.)
interface EnhancedTableProps {
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof ISubjectTableData) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}
function EnhancedTableHead(props: EnhancedTableProps) {
	const { order, orderBy, rowCount, onRequestSort } = props;
	const createSortHandler =
		(property: keyof ISubjectTableData) => (event: React.MouseEvent<unknown>) => {
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
			</TableRow>
		</TableHead>
	);
}

const SubjectTableSkeleton = () => {
	return (
		<div className='w-full h-fit flex flex-col justify-center items-center px-5 pt-[5vh]'>
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
							Môn học
						</h2>
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
										<TableRow hover role='checkbox' tabIndex={-1} key={index}>
											<TableCell
												component='th'
												scope='row'
												padding='normal'
												align='left'
											>
												<Skeleton animation='wave' variant='text' />{' '}
											</TableCell>
											<TableCell
												align='left'
												width={250}
												sx={{
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
												}}
											>
												<Skeleton animation='wave' variant='text' />{' '}
											</TableCell>
											<TableCell align='left'>
												<Skeleton animation='wave' variant='text' />
											</TableCell>
											<TableCell align='left' width={130}>
												<Skeleton animation='wave' variant='text' />{' '}
											</TableCell>
											<TableCell align='center' width={150}>
												<Skeleton animation='wave' variant='text' />
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

export default SubjectTableSkeleton;

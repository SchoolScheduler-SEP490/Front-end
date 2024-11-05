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
import { ISubjectTableData } from '../_libs/constants';

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

function EnhancedTableHead() {
	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.centered ? 'center' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sx={[
							{ fontWeight: 'bold' },
							headCell.centered ? { paddingLeft: '3%' } : {},
						]}
					>
						<TableSortLabel active={true} direction={'desc'}>
							{headCell.label}
							<Box
								component='span'
								sx={[visuallyHidden, { position: 'absolute', zIndex: 10 }]}
							>
								{'sorted descending'}
							</Box>
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

const SubjectTableSkeleton = () => {
	return (
		<div className='w-full h-fit flex flex-col justify-center items-center px-[10vw] pt-[5vh]'>
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
					</Toolbar>
					<TableContainer>
						<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size='medium'>
							<EnhancedTableHead />
							<TableBody>
								{[1, 2, 3, 4, 5].map((row, index) => {
									const labelId = `enhanced-table-checkbox-${index}`;

									return (
										<TableRow
											hover
											role='checkbox'
											tabIndex={-1}
											key={index}
											sx={{ cursor: 'pointer' }}
										>
											<TableCell
												component='th'
												id={labelId}
												scope='row'
												padding='normal'
												align='left'
											>
												<Skeleton animation='wave' variant='text' />
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
												<Skeleton animation='wave' variant='text' />
											</TableCell>
											<TableCell align='left'>
												<Skeleton animation='wave' variant='text' />
											</TableCell>
											<TableCell align='left' width={130}>
												<Skeleton animation='wave' variant='text' />
											</TableCell>
											<TableCell align='center' width={150}>
												<Skeleton animation='wave' variant='text' />
											</TableCell>
											<TableCell width={80}>
												<IconButton
													color='success'
													sx={{ zIndex: 10 }}
													id={`basic-button${index}`}
													aria-controls={`basic-menu${index}`}
													aria-haspopup='true'
												>
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

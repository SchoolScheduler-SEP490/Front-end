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
import Image from 'next/image';
import { ISubjectGroupTableData } from '../_libs/constants';

interface HeadCell {
	disablePadding: boolean;
	id: keyof ISubjectGroupTableData;
	label: string;
	centered: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id' as keyof ISubjectGroupTableData,
		centered: false,
		disablePadding: false,
		label: 'STT',
	},
	{
		id: 'subjectGroupName' as keyof ISubjectGroupTableData,
		centered: false,
		disablePadding: false,
		label: 'Tên khối',
	},
	{
		id: 'subjectGroupCode' as keyof ISubjectGroupTableData,
		centered: false,
		disablePadding: false,
		label: 'Mã tổ hợp',
	},
	{
		id: 'grade' as keyof ISubjectGroupTableData,
		centered: false,
		disablePadding: false,
		label: 'Khối áp dụng',
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

const SubjectGroupTableSkeleton = () => {
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
							Tổ hợp môn
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
										<TableRow hover role='checkbox' tabIndex={-1} key={index}>
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
												width={300}
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
											<TableCell align='left' width={200}>
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

export default SubjectGroupTableSkeleton;

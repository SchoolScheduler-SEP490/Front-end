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
import TableRow from '@mui/material/TableRow';
import { ITeachingAssignmentTableData } from '../_libs/constants';
import LayersIcon from '@mui/icons-material/Layers';

interface HeadCell {
	disablePadding: boolean;
	id: keyof ITeachingAssignmentTableData;
	label: string;
	centered: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id' as keyof ITeachingAssignmentTableData,
		centered: false,
		disablePadding: false,
		label: 'STT',
	},
	{
		id: 'subjectName' as keyof ITeachingAssignmentTableData,
		centered: false,
		disablePadding: false,
		label: 'Môn học',
	},
	{
		id: 'teacherName' as keyof ITeachingAssignmentTableData,
		centered: false,
		disablePadding: false,
		label: 'Tên giáo viên',
	},
	{
		id: 'totalSlotPerWeek' as keyof ITeachingAssignmentTableData,
		centered: true,
		disablePadding: true,
		label: 'Số tiết/tuần',
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
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

const TeachingAssignmentTableSkeleton = () => {
	return (
		<div className='relative w-[65%] h-fit flex flex-row justify-center items-center pt-[2vh]'>
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
							Phân công giảng dạy
						</h2>
						<div className='h-fit w-fit flex flex-row justify-center items-center gap-2'>
							<Tooltip title='Áp dụng đồng thời'>
								<IconButton>
									<LayersIcon fontSize='medium' />
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
						<Table aria-labelledby='tableTitle' size='small'>
							<EnhancedTableHead />
							<TableBody>
								{[1, 2, 3, 4, 5, 6, 7, 8].map((row, index) => {
									const labelId = `enhanced-table-checkbox-${index}`;

									return (
										<TableRow
											hover
											role='checkbox'
											tabIndex={-1}
											key={index}
											sx={{ cursor: 'pointer', userSelect: 'none' }}
										>
											<TableCell
												component='th'
												id={labelId}
												scope='row'
												padding='normal'
												align='center'
												width={50}
											>
												<Skeleton
													animation='wave'
													variant='text'
												/>
											</TableCell>
											<TableCell
												align='left'
												width={215}
												sx={{
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
												}}
											>
												<Skeleton
													animation='wave'
													variant='text'
												/>
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
												<Skeleton
													animation='wave'
													variant='text'
												/>
											</TableCell>
											<TableCell
												align='center'
												width={80}
												sx={{
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
												}}
											>
												<Skeleton
													animation='wave'
													variant='text'
												/>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>
				</Paper>
			</Box>
		</div>
	);
};

export default TeachingAssignmentTableSkeleton;

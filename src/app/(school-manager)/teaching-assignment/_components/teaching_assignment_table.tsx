'use client';

import AddTaskIcon from '@mui/icons-material/AddTask';
import FilterListIcon from '@mui/icons-material/FilterList';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Toolbar, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
import { KeyedMutator } from 'swr';
import {
	ITeacherAssignmentRequest,
	ITeachingAssignmentTableData,
} from '../_libs/constants';

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

interface ITeachingAssignmentTableProps {
	subjectData: ITeachingAssignmentTableData[];
	mutate?: KeyedMutator<any>;
	isFilterable: boolean;
	setIsFilterable: React.Dispatch<React.SetStateAction<boolean>>;
}

const TeachingAssignmentTable = (props: ITeachingAssignmentTableProps) => {
	const { subjectData, mutate, isFilterable, setIsFilterable } = props;

	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [editingObjects, setEditingObjects] = useState<ITeacherAssignmentRequest[]>([]);
	const [isCancelUpdateModalOpen, setIsCancelUpdateModalOpen] =
		useState<boolean>(false);

	const handleFilterable = () => {
		setIsFilterable(!isFilterable);
	};

	// const handleMouseDown = (rowIndex: number) => {
	// 	setIsSelecting(true);
	// 	const updatedSelectedRows = new Set(selectedRows);
	// 	updatedSelectedRows.add(rowIndex);
	// 	setSelectedRows(updatedSelectedRows);
	// };
	// const handleMouseUp = () => {
	// 	setIsSelecting(false);
	// };
	// const handleMouseEnter = (rowIndex: number) => {
	// 	if (isSelecting) {
	// 		const updatedSelectedRows = new Set(selectedRows);
	// 		updatedSelectedRows.add(rowIndex);
	// 		setSelectedRows(updatedSelectedRows);
	// 	}
	// };

	const handleConfirmCancelUpdate = () => {
		setIsCancelUpdateModalOpen(true);
	};

	const handleCancelUpdateLesson = () => {
		setIsEditing(false);
		setEditingObjects([]);
		setIsCancelUpdateModalOpen(false);
	};

	const handleConfirmUpdate = async () => {};

	return (
		<div className='relative w-[60%] h-fit flex flex-row justify-center items-center pt-[2vh]'>
			<Box sx={{ width: '100%' }}>
				<Paper sx={{ width: '100%', mb: 2 }}>
					<Toolbar
						sx={[
							{
								pl: { sm: 2 },
								pr: { xs: 1, sm: 1 },
								width: '100%',
							},
							isEditing && {
								bgcolor: '#e8f0f5',
							},
						]}
					>
						<h2 className='text-title-medium-strong font-semibold w-full text-left'>
							Tiết học
						</h2>
						<div className='h-fit w-fit flex flex-row justify-center items-center gap-2'>
							{isEditing && (
								<>
									<Tooltip title='Lưu thay đổi'>
										<IconButton
											color='success'
											onClick={handleConfirmUpdate}
										>
											<AddTaskIcon />
										</IconButton>
									</Tooltip>
									<Tooltip title='Hủy bỏ'>
										<IconButton
											onClick={handleConfirmCancelUpdate}
											color='error'
										>
											<HighlightOffIcon />
										</IconButton>
									</Tooltip>
								</>
							)}
							<Tooltip title='Lọc danh sách'>
								<IconButton
									id='filter-btn'
									aria-controls={
										isFilterable ? 'basic-menu' : undefined
									}
									aria-haspopup='true'
									aria-expanded={isFilterable ? 'true' : undefined}
									onClick={handleFilterable}
								>
									<FilterListIcon />
								</IconButton>
							</Tooltip>
						</div>
					</Toolbar>
					<TableContainer>
						<Table aria-labelledby='tableTitle' size='medium'>
							<EnhancedTableHead />
							<TableBody>
								{subjectData.map((row, index) => {
									const labelId = `enhanced-table-checkbox-${index}`;

									return (
										<TableRow
											hover
											role='checkbox'
											tabIndex={-1}
											key={row.id}
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
												{index + 1}
											</TableCell>
											<TableCell
												align='left'
												width={160}
												sx={{
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
												}}
											>
												{row.subjectName}
											</TableCell>
											<TableCell
												align='left'
												sx={{
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
												}}
											>
												{row.teacherName ?? '- - - - -'}
											</TableCell>
											<TableCell
												align='center'
												sx={{
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
												}}
											>
												{row.totalSlotPerWeek}
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

export default TeachingAssignmentTable;

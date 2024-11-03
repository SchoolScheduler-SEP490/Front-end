'use client';

import useFilterArray from '@/hooks/useFilterArray';
import useNotify from '@/hooks/useNotify';
import AddTaskIcon from '@mui/icons-material/AddTask';
import FilterListIcon from '@mui/icons-material/FilterList';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Autocomplete, TextField, Toolbar, Tooltip } from '@mui/material';
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
	IDropdownOption,
	ITeacherAssignmentRequest,
	ITeachingAssignmentTableData,
} from '../_libs/constants';
import useAssignTeacher from '../_hooks/useAssignTeacher';
import { useAppContext } from '@/context/app_provider';

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
	mutate: KeyedMutator<any>;
	isFilterable: boolean;
	setIsFilterable: React.Dispatch<React.SetStateAction<boolean>>;
	selectedClass: number;
	selectedTerm: number;
}

const TeachingAssignmentTable = (props: ITeachingAssignmentTableProps) => {
	const {
		subjectData,
		mutate,
		isFilterable,
		setIsFilterable,
		selectedClass,
		selectedTerm,
	} = props;
	const { sessionToken } = useAppContext();

	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [editingObjects, setEditingObjects] = useState<ITeacherAssignmentRequest[]>([]);
	const [isCancelUpdateModalOpen, setIsCancelUpdateModalOpen] =
		useState<boolean>(false);

	const handleFilterable = () => {
		setIsFilterable(!isFilterable);
	};

	const handleConfirmCancelUpdate = () => {
		setIsCancelUpdateModalOpen(true);
		handleCancelUpdateLesson();
	};

	const handleCancelUpdateLesson = () => {
		setIsEditing(false);
		setEditingObjects([]);
		setIsCancelUpdateModalOpen(false);
	};

	const handleConfirmUpdate = async () => {
		editingObjects.map((item) => {
			useAssignTeacher({
				sessionToken: sessionToken,
				formData: item,
			}).then(() => {
				mutate();
			});
		});
		setIsEditing(false);
		setEditingObjects([]);
	};

	const handleAssignTeacher = (subjectId: number, selectedTeacherId: number) => {
		setIsEditing(true);
		var editingObject: ITeacherAssignmentRequest | undefined = editingObjects.find(
			(item) => item['subject-id'] === subjectId
		);
		if (!editingObject) {
			editingObject = {
				'subject-id': subjectId,
				'teacher-id': selectedTeacherId ?? 0,
				'student-class-id': selectedClass,
				'period-count': 0,
				'term-id': selectedTerm,
			};
		} else {
			editingObject['teacher-id'] = selectedTeacherId;
		}
		setEditingObjects(
			useFilterArray([...editingObjects, editingObject], 'subject-id')
		);
	};

	const handleUpdatePeriodCount = (subjectId: number, periodCount: number) => {
		if (periodCount < 0) {
			useNotify({
				message: 'Số tiết không thể nhỏ hơn 0',
				type: 'error',
			});
			return;
		}
		if (periodCount > 10) {
			useNotify({
				message: 'Số tiết không thể vượt quá 10',
				type: 'error',
			});
			return;
		}
		if (periodCount === 0) {
			useNotify({
				message: 'Phải có ít nhất 1 tiết/tuần',
				type: 'error',
			});
			return;
		}
		setIsEditing(true);
		var editingObject: ITeacherAssignmentRequest | undefined = editingObjects.find(
			(item) => item['subject-id'] === subjectId
		);
		if (!editingObject) {
			editingObject = {
				'subject-id': subjectId,
				'teacher-id': 0,
				'student-class-id': selectedClass,
				'period-count': periodCount,
				'term-id': selectedTerm,
			};
		} else {
			editingObject['period-count'] = periodCount;
		}
		setEditingObjects(
			useFilterArray([...editingObjects, editingObject], 'subject-id')
		);
	};

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
							isEditing && {
								bgcolor: '#e8f0f5',
							},
						]}
					>
						<h2 className='text-title-medium-strong font-semibold w-full text-left'>
							Phân công giảng dạy
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
									const editedObject:
										| ITeacherAssignmentRequest
										| undefined =
										editingObjects.find(
											(item) => item['subject-id'] === row.id
										) ?? undefined;

									return (
										<TableRow
											hover
											role='checkbox'
											tabIndex={-1}
											key={row.id}
											sx={[
												{ cursor: 'pointer', userSelect: 'none' },
												editedObject !== undefined && {
													bgcolor: '#fff0eb',
												},
											]}
										>
											<TableCell
												component='th'
												id={labelId}
												width={50}
												scope='row'
												padding='normal'
												align='center'
											>
												{index + 1}
											</TableCell>
											<TableCell
												align='left'
												width={100}
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
												width={250}
												sx={{
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
												}}
											>
												<Autocomplete
													options={row.availableTeachers}
													getOptionLabel={(
														option: IDropdownOption<number>
													) => option.label}
													getOptionKey={(
														option: IDropdownOption<number>
													) => option.value}
													fullWidth
													disableClearable
													defaultValue={
														row.availableTeachers.find(
															(teacher) =>
																teacher.label ===
																row.teacherName
														) ?? row.availableTeachers[0]
													}
													onChange={(
														event: any,
														newValue: IDropdownOption<number> | null
													) => {
														if (newValue !== null) {
															handleAssignTeacher(
																row.id,
																newValue.value
															);
														}
													}}
													blurOnSelect
													renderInput={(params) => (
														<TextField
															{...params}
															variant='standard'
														/>
													)}
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
												<TextField
													variant='standard'
													type='number'
													sx={{
														width: '60%',
														'& .MuiInputBase-input': {
															textAlign: 'center',
														},
														'& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
															{
																position: 'absolute',
																right: '0',
																top: '50%',
																transform:
																	'translateY(-50%)',
																zIndex: 10,
															},
													}}
													onChange={(
														event: React.ChangeEvent<HTMLInputElement>
													) =>
														handleUpdatePeriodCount(
															row.id,
															Number(event.target.value)
														)
													}
													value={
														!editedObject
															? row.totalSlotPerWeek
															: editedObject['period-count']
													}
													id='fullWidth'
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

export default TeachingAssignmentTable;

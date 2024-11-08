'use client';

import { useAppContext } from '@/context/app_provider';
import useFilterArray from '@/hooks/useFilterArray';
import AddTaskIcon from '@mui/icons-material/AddTask';
import FilterListIcon from '@mui/icons-material/FilterList';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import LayersIcon from '@mui/icons-material/Layers';
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
import { useEffect, useState } from 'react';
import { KeyedMutator } from 'swr';
import { IDropdownOption } from '../../_utils/contants';
import useAssignTeacher from '../_hooks/useAssignTeacher';
import useFetchTeachableTeacher from '../_hooks/useFetchTeachableTeacher';
import {
	ITeachableResponse,
	ITeacherAssignmentRequest,
	ITeachingAssignmentResponse,
	ITeachingAssignmentTableData,
} from '../_libs/constants';
import CancelAssignTeacherModal from './teaching_assignment_modal_cancel';
import TeachingAssignmentApplyModal from './teaching_assignment_modal_apply';

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
}

const TeachingAssignmentTable = (props: ITeachingAssignmentTableProps) => {
	const { subjectData, mutate, isFilterable, setIsFilterable } = props;
	const { sessionToken, schoolId, selectedSchoolYearId } = useAppContext();

	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [editingObjects, setEditingObjects] = useState<ITeacherAssignmentRequest[]>([]);
	const [teachableDropdown, setTeachableDropdown] = useState<IDropdownOption<number>[]>([]);
	const [selectedSubjectId, setSelectedSubjectId] = useState<number>(
		subjectData[0]?.subjectKey ?? 0
	);
	const [isCancelUpdateModalOpen, setIsCancelUpdateModalOpen] = useState<boolean>(false);
	const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
	const [applicableSubjects, setApplicableSubjects] = useState<ITeachingAssignmentTableData[]>(
		[]
	);

	const { data: teachableData, mutate: getTeachableData } = useFetchTeachableTeacher({
		schoolId: Number(schoolId),
		subjectId: selectedSubjectId,
		sessionToken,
	});

	useEffect(() => {
		if (teachableData?.status === 200) {
			const dropdownOptions: IDropdownOption<number>[] = teachableData.result.map(
				(item: ITeachableResponse) => {
					return {
						value: item['teacher-id'],
						label: `${item['teacher-name']} (${item['teacher-abreviation']})`,
					} as IDropdownOption<number>;
				}
			);
			setTeachableDropdown([...dropdownOptions]);
		}
	}, [teachableData, selectedSubjectId]);

	useEffect(() => {
		if (subjectData.length > 0) {
			const assignedSubjects: ITeachingAssignmentTableData[] = subjectData.filter(
				(item) => item.teacherName.label !== '- - -'
			);
			setApplicableSubjects(assignedSubjects);
		}
	}, [subjectData]);

	const handleFilterable = () => {
		setIsFilterable(!isFilterable);
	};

	const handleConfirmCancelUpdate = () => {
		setIsCancelUpdateModalOpen(true);
	};

	const handleCancelUpdateTeachingAssignment = () => {
		setIsEditing(false);
		setEditingObjects([]);
		setIsCancelUpdateModalOpen(false);
		mutate();
	};

	const handleConfirmUpdate = async () => {
		await useAssignTeacher({
			sessionToken: sessionToken,
			formData: editingObjects,
			schoolId: Number(schoolId),
			schoolYearId: selectedSchoolYearId,
		});
		mutate();
		setIsEditing(false);
		setEditingObjects([]);
	};

	const handleAssignTeacher = (assignmentId: number, selectedTeacherId: number) => {
		setIsEditing(true);
		var editingObject: ITeacherAssignmentRequest | undefined = editingObjects.find(
			(item) => item.id === assignmentId
		);
		if (!editingObject) {
			editingObject = {
				id: assignmentId,
				'teacher-id': selectedTeacherId ?? 0,
			};
		} else {
			editingObject['teacher-id'] = selectedTeacherId;
		}
		setEditingObjects(useFilterArray([...editingObjects, editingObject], 'id'));
	};

	const handleSelectSubject = (subjectId: number) => {
		setSelectedSubjectId(subjectId);
		getTeachableData({ subjectId: selectedSubjectId });
	};

	const handleMultipleApply = () => {};

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
							{isEditing ? (
								<>
									<Tooltip title='Lưu thay đổi'>
										<IconButton color='success' onClick={handleConfirmUpdate}>
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
							) : (
								<Tooltip title='Áp dụng đồng thời'>
									<IconButton
										id='filter-btn'
										aria-controls={isFilterable ? 'basic-menu' : undefined}
										aria-haspopup='true'
										aria-expanded={isFilterable ? 'true' : undefined}
										onClick={handleMultipleApply}
									>
										<LayersIcon fontSize='medium' />
									</IconButton>
								</Tooltip>
							)}
							<Tooltip title='Lọc danh sách'>
								<IconButton
									id='filter-btn'
									aria-controls={isFilterable ? 'basic-menu' : undefined}
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
						<Table aria-labelledby='tableTitle' size='small'>
							<EnhancedTableHead />
							<TableBody>
								{subjectData.length === 0 && (
									<TableRow>
										<TableCell colSpan={4} align='center'>
											<h1 className='text-body-large-strong italic text-basic-gray'>
												Lớp học chưa áp dụng Tổ hợp
											</h1>
										</TableCell>
									</TableRow>
								)}
								{subjectData.map((row, index) => {
									const labelId = `enhanced-table-checkbox-${index}`;
									const editedObject: ITeacherAssignmentRequest | undefined =
										editingObjects.find((item) => item.id === row.id) ??
										undefined;

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
													options={teachableDropdown}
													getOptionLabel={(
														option: IDropdownOption<number>
													) => option.label}
													getOptionKey={(
														option: IDropdownOption<number>
													) => option.value}
													fullWidth
													noOptionsText='Không có giáo viên phù hợp'
													disableClearable
													defaultValue={row.teacherName}
													onOpen={() => {
														handleSelectSubject(row.subjectKey);
													}}
													onBlur={() => {
														setTeachableDropdown([]);
													}}
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
														<TextField {...params} variant='standard' />
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
			<CancelAssignTeacherModal
				open={isCancelUpdateModalOpen}
				setOpen={setIsCancelUpdateModalOpen}
				handleApprove={handleCancelUpdateTeachingAssignment}
			/>
			<TeachingAssignmentApplyModal
				open={isApplyModalOpen}
				setOpen={setIsApplyModalOpen}
				applicableSubjects={applicableSubjects}
			/>
		</div>
	);
};

export default TeachingAssignmentTable;
